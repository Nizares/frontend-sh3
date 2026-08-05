"use client";
import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '@/src/services/authService';
import { profileService } from '@/src/services/profileService';
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

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            profileService.getProfile()
                .then(res => {
                    const profile = res.data.data;
                    const participant = profile.participant ?? {};
                    const fullUser = {
                        ...profile.user,
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
                    };
                    setUser(fullUser);
                    localStorage.setItem('user', JSON.stringify(fullUser));
                })
                .catch(() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    delete api.defaults.headers.common['Authorization'];
                    setUser(null);
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const logout = () => {
        authService.logout().catch(() => {});
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
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