"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Profile {
    address: string;
}

interface AuthContextType {
    profile: Profile | null;
    login: (profile: Profile) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [profile, setProfile] = useState<Profile | null>(null);

    const login = (profile: Profile) => {
        setProfile(profile);
    };

    const logout = () => {
        setProfile(null);
    };

    return (
        <AuthContext.Provider value={{ profile, login, logout }
        }>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};