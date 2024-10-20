"use client"

import type { ReactNode } from 'react';
import type React from 'react';
import { createContext, useContext, useMemo, useState } from 'react';
import { connectWallet, type WalletKeys } from './wallet';


interface AuthContextType {
    profile: WalletKeys | null;
    login: () => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [profile, setProfile] = useState<WalletKeys | null>(null);

    const login = async () => {
        const wallet = await connectWallet();
        setProfile(wallet);
    };

    const logout = () => {
        setProfile(null);
    };

    // biome-ignore lint/correctness/useExhaustiveDependencies: only profile is changing
    const auth = useMemo(() => ({ profile, login, logout }), [profile]);

    console.log('profile', profile);

    return (
        <AuthContext.Provider value={auth}>
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