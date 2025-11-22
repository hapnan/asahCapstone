import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from './api';

// Auth context type
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check if user has valid session on mount
    useEffect(() => {
        checkSession();
    }, []);

    const checkSession = async () => {
        try {
            const response = await authAPI.checkSession();

            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error('Error checking session:', error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (userData) => {
        setUser(userData);
        // No need to store in localStorage - session is in httpOnly cookie
        await checkSession();
    };

    const logout = async () => {
        try {
            await authAPI.logout();
        } catch (error) {
            console.error('Error logging out:', error);
        } finally {
            setUser(null);
        }
    };

    const value = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        checkSession,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
