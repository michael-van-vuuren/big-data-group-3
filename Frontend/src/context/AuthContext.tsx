"use client";

import React, {
    useCallback,
    createContext,
    useState,
    useContext,
    useEffect,
    ReactNode
} from 'react';
import { authApi } from '@/lib/api';
import { useRouter, usePathname } from 'next/navigation';

interface User {
    name: string;
    email: string;
    role: 'USER' | 'BUSINESS' | string;
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

/* --- Role-based paths --- */
const userPaths = ['/quiz', '/flavors', '/account'];
const businessPaths = [...userPaths, '/business'];

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    const isUserPath = userPaths.some((path) => pathname.startsWith(path));
    const isBusinessPath = businessPaths.some((path) => pathname.startsWith(path));
    const isPathProtected = isUserPath || isBusinessPath;

    // Authentication checker function
    const checkAuthStatus = useCallback(async () => {
        setIsLoading(true);
        try {
            const userData = await authApi.getMe();
            if (!userData) {
                throw new Error("No user data returned from /auth/me.");
            }
            if (!userData.role) {
                console.warn("User data fetched successfully but missing role:", userData);
            }
            setUser(userData);
        } catch (error) {
            setUser(null);
            if (isPathProtected && pathname !== '/login') {
                console.log("Auth check failed, redirect required for protected path:", pathname);
                try {
                    await authApi.logoutUser();
                } catch (logoutError) {
                    console.error("Failed to clear session during auto-logout:", logoutError);
                }
                router.push('/login');
            }
        } finally {
            setIsLoading(false);
        }
    }, [pathname, isPathProtected, router]);

    // Check authentication continuously
    useEffect(() => {
        checkAuthStatus();
    }, [checkAuthStatus]);

    // Login logic
    const login = (userData: User) => {
        if (!userData.role) {
            console.warn("User logged in but missing role:", userData);
        }
        setUser(userData);
        setIsLoading(false);
    };

    // Logout logic
    const logout = async () => {
        setIsLoading(true);
        const currentlyProtected =
            userPaths.some((path) => pathname.startsWith(path)) ||
            businessPaths.some((path) => pathname.startsWith(path));

        try {
            await authApi.logoutUser();
        } catch (error) {
            console.error("Logout API call failed:", error);
        } finally {
            setUser(null);
            setIsLoading(false);
            if (currentlyProtected && pathname !== '/login') {
                router.push('/login');
            }
        }
    };

    // Protected path logic
    useEffect(() => {
        if (
            !isLoading &&
            isPathProtected &&
            pathname !== '/login' &&
            (
                !user ||
                !user.role ||
                (user.role === 'USER' && !isUserPath) ||
                (user.role === 'BUSINESS' && !isBusinessPath)
            )
        ) {
            console.log("Redirecting due to invalid access:", {
                pathname,
                user,
                isUserPath,
                isBusinessPath
            });
            router.push('/');
        }
    }, [user, isLoading, pathname, isPathProtected, isUserPath, isBusinessPath, router]);

    let allowChildrenRender = false;

    if (!isPathProtected) {
        allowChildrenRender = true;
    } else if (!isLoading && user && user.role) {
        if (
            (user.role === 'BUSINESS' && isBusinessPath) ||
            (user.role === 'USER' && isUserPath)
        ) {
            allowChildrenRender = true;
        }
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                login,
                logout,
                checkAuthStatus
            }}
        >
            {allowChildrenRender ? children : null}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
