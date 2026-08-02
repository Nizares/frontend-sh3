import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '@/src/services/authService';
import { profileService } from '@/src/services/profileService'; // ← tambah
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
            profileService.getProfile() // ← ganti dari authService.getProfile()
                .then(res => {
                    const userData = res.data.data ?? res.data;
                    setUser(userData);
                    localStorage.setItem('user', JSON.stringify(userData));
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
        <AuthContext.Provider value={{ user, loading, logout, setAuthUser, isLoggedIn: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth harus digunakan di dalam AuthProvider');
    return context;
};