"use client";

import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '@/src/services/authService';
import { profileService } from '@/src/services/profileService';
import { guestSponsorService } from '@/src/services/guestSponsorService';
import api from '@/src/services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const setAuthUser = (userData) => {
        setUser(userData);
        if (userData) {
            localStorage.setItem('user', JSON.stringify(userData));
        } else {
            localStorage.removeItem('user');
        }
    };

    // 🔥 LOGIN UNTUK MEMBER (username + password)
    const login = async (username, password) => {
        setLoading(true);
        try {
            const response = await api.post('/auth/login', { 
                username, 
                password 
            });
            
            const { token, user: userData } = response.data.data || response.data;
            
            // Simpan token
            localStorage.setItem('token', token);
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            // Ambil profile lengkap (untuk member)
            const profileRes = await profileService.getProfile();
            const profile = profileRes.data.data;
            const participant = profile.participant ?? {};
            
            const fullUser = {
                ...profile.user,
                role: profile.user?.role || 'participant',
                participant_id: participant.id,
                phone: participant.phone,
                gender: participant.gender,
                date_of_birth: participant.date_of_birth,
                address: participant.address,
                blood_type: participant.blood_type,
                jersey_size: participant.jersey_size,
                emergency_contact: participant.emergency_contact,
                emergency_phone: participant.emergency_phone,
                medical_conditions: participant.medical_conditions,
                membership_type: participant.membership_type,
                membership_start_date: participant.membership_start_date,
                membership_end_date: participant.membership_end_date,
                is_active: participant.is_active,
                hash_id: participant.hash_id,
            };
            
            setUser(fullUser);
            localStorage.setItem('user', JSON.stringify(fullUser));
            
            return fullUser;
            
        } catch (error) {
            console.error('Login error:', error.response?.data);
            const message = error.response?.data?.message || 'Username atau password salah.';
            throw new Error(message);
        } finally {
            setLoading(false);
        }
    };

    // 🔥 LOGIN UNTUK GUEST SPONSOR (username + password)
    const loginGuestSponsor = async (username, password) => {
        setLoading(true);
        try {
            const response = await guestSponsorService.login(username, password);
            const { token, user: userData } = response.data.data || response.data;
            
            // Simpan token
            localStorage.setItem('token', token);
            localStorage.setItem('role', 'guest_sponsor');
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            // 🔥 Guest sponsor tidak punya participant, langsung pakai data dari response
            const fullUser = {
                ...userData,
                role: 'guest_sponsor',
                // Guest sponsor tidak punya field membership
                membership_type: null,
                membership_start_date: null,
                membership_end_date: null,
                is_active: userData.is_active ?? true,
            };
            
            setUser(fullUser);
            localStorage.setItem('user', JSON.stringify(fullUser));
            
            return fullUser;
            
        } catch (error) {
            console.error('Guest Sponsor Login error:', error.response?.data);
            const message = error.response?.data?.message || 'Username atau password salah.';
            throw new Error(message);
        } finally {
            setLoading(false);
        }
    };

    // 🔥 CEK TOKEN SAAT MOUNT
    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            // 🔥 Jika guest sponsor, langsung ambil dari localStorage
            if (role === 'guest_sponsor') {
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    try {
                        const parsedUser = JSON.parse(storedUser);
                        setUser(parsedUser);
                        setLoading(false);
                        return;
                    } catch (err) {
                        console.error('Error parsing guest sponsor user:', err);
                    }
                }
                
                // Jika tidak ada user di localStorage, fetch dari API
                guestSponsorService.getProfile()
                    .then(res => {
                        const userData = res.data.data;
                        const fullUser = {
                            ...userData,
                            role: 'guest_sponsor',
                        };
                        setUser(fullUser);
                        localStorage.setItem('user', JSON.stringify(fullUser));
                    })
                    .catch(() => {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        localStorage.removeItem('role');
                        delete api.defaults.headers.common['Authorization'];
                        setUser(null);
                    })
                    .finally(() => setLoading(false));
                return;
            }
            
            // 🔥 Member: fetch profile via profileService
            profileService.getProfile()
                .then(res => {
                    const profile = res.data.data;
                    const participant = profile.participant ?? {};
                    const fullUser = {
                        ...profile.user,
                        role: profile.user?.role || 'participant',
                        participant_id: participant.id,
                        phone: participant.phone,
                        gender: participant.gender,
                        date_of_birth: participant.date_of_birth,
                        address: participant.address,
                        blood_type: participant.blood_type,
                        jersey_size: participant.jersey_size,
                        emergency_contact: participant.emergency_contact,
                        emergency_phone: participant.emergency_phone,
                        medical_conditions: participant.medical_conditions,
                        membership_type: participant.membership_type,
                        membership_start_date: participant.membership_start_date,
                        membership_end_date: participant.membership_end_date,
                        is_active: participant.is_active,
                        hash_id: participant.hash_id,
                    };
                    setUser(fullUser);
                    localStorage.setItem('user', JSON.stringify(fullUser));
                })
                .catch(() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    localStorage.removeItem('role');
                    delete api.defaults.headers.common['Authorization'];
                    setUser(null);
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    // 🔥 LOGOUT
    const logout = () => {
        authService.logout().catch(() => {});
        guestSponsorService.logout?.().catch(() => {});
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            loginGuestSponsor,  // ✅ Tambahkan untuk guest sponsor
            logout,
            setAuthUser,
            isLoggedIn: !!user,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth harus digunakan di dalam AuthProvider');
    return context;
};