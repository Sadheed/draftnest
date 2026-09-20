// client/src/context/AuthContext.js

import React, { useState } from 'react';
import api from '../api/axios'; // Use the configured Axios instance
import { AuthContext } from './AuthContext.js';

const readStoredUser = () => {
    try {
        return JSON.parse(localStorage.getItem('user')) || null;
    } catch {
        localStorage.removeItem('user');
        return null;
    }
};

export const AuthProvider = ({ children }) => {
    // Initialize state from localStorage
    const [user, setUser] = useState(readStoredUser);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const isLoggedIn = !!user;

    // Login function handles API call and state updates
    const login = async (email, password) => {
        try {
            const { data } = await api.post('/auth/login', { email, password });
            
            // Store user and token
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify({ _id: data._id, username: data.username }));
            
            setToken(data.token);
            setUser({ _id: data._id, username: data.username });
            return true;
        } catch (error) {
            console.error('Login failed:', error.response?.data?.message || error.message);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        // Note: Full page refresh may be needed to clear global state cleanly
        window.location.href = '/login'; 
    };

    return (
        <AuthContext.Provider value={{ user, isLoggedIn, login, logout, token }}>
            {children}
        </AuthContext.Provider>
    );
};

