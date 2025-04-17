"use client";

import React, { useCallback, createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { getMe, logoutUser } from '@/lib/apiClient';
import { useRouter, usePathname } from 'next/navigation';

interface User {
    name: string;
    email: string;
    // TODO: role
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (userData: User) => void;
    logout: () => void;
    checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

// AuthProvider is initialized in app/clientLayout.tsx
export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true); // Start loading initially
    const router = useRouter();
    const pathname = usePathname();

    const protectedPaths = ['/quiz', '/flavors', '/account'];
    const isPathProtected = protectedPaths.some((path) => pathname.startsWith(path));

    const checkAuthStatus = useCallback(async () => {
        setIsLoading(true);
        let shouldRedirect = false;
    
        try {
            const userData: User = await getMe();
            setUser(userData);
        } catch (error) {
            setUser(null);
            if (isPathProtected && pathname !== '/login') {
                shouldRedirect = true;
                console.log("Auth check failed, redirect required for:", pathname);
                try {
                    await logoutUser();
                } catch (logoutError) {
                    console.error("Failed to clear session during auto-logout:", logoutError);
                }
            }
        } finally {
            setIsLoading(false);
            if (shouldRedirect) {
                console.log("Executing redirect to /login");
                router.push('/login');
            }
        }
    }, [pathname, isPathProtected, router]);
    
    useEffect(() => {
        checkAuthStatus();
    }, [checkAuthStatus]);

    const login = (userData: User) => {
        setUser(userData);
        setIsLoading(false);
    };

    const logout = async () => {
        setIsLoading(true);
        const currentlyProtected = protectedPaths.some((path) => pathname.startsWith(path));
        try {
            await logoutUser();
        } catch (error) {
             console.error("Logout API call failed:", error);
        } finally {
            setUser(null);
            setIsLoading(false);
            if (currentlyProtected && pathname !== '/login') {
                 router.push('/login');
            } else if (pathname === '/login') {
                // router.refresh();
            }
        }
    };

    // loading screen is just null (displays current page while loading)
    let allowChildrenRender = false;
    if (!isPathProtected) {
        // public path: Always allow rendering immediately
        allowChildrenRender = true;
    } else {
        // protected path:
        if (isLoading) {
            // still loading: do not render children
            allowChildrenRender = false;
        } else {
            // loading done and user: render children only if user is authenticated
            if (user) {
                allowChildrenRender = true;
            } else {
                // loading done but no user: do not render children
                allowChildrenRender = false;
            }
        }
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout, checkAuthStatus }}>
            {allowChildrenRender ? children : null}
        </AuthContext.Provider>
    );
};


// useAuth hook
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
