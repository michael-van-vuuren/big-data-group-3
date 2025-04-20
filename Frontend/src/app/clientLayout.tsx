'use client';

import { ReactNode, useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

import { AuthProvider, useAuth } from '@/context/AuthContext';
import NavigationMenuDemo from '@/components/navigation';
import { authApi } from '@/lib/api';
import { Button } from '@/components/button';

function LogoutButton() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await authApi.logoutUser();
      location.reload();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="z-50 mr-6">
      <Button onClick={handleLogout} variant='logout' size='logout' disabled={loading}>
        Logout
      </Button>
    </div>
  );
}


export default function ClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const previousPathnameRef = useRef<string | null>(null);

  // Clear selectedSubCategory on navigation away from /flavors/**
  useEffect(() => {
    const currentPath = pathname;
    const previousPath = previousPathnameRef.current;

    // User navigates away from /flavors/**
    if (
      previousPath &&
      previousPath.startsWith('/flavors/') &&
      !currentPath.startsWith('/flavors/')
    ) {
      console.log(`Navigating away from flavors: ${previousPath} -> ${currentPath}. Clearing sessionStorage.`);
      sessionStorage.removeItem('selectedSubCategory');
    }

    previousPathnameRef.current = currentPath;

  }, [pathname]);


  return (
    <AuthProvider>
      <header className="flex items-center justify-between bg-specialBlue grid-bg-light">
        {/* Left side: navigation bar */}
        <NavigationMenuDemo />

        {/* Right side: logout button */}
        <LogoutButton />
      </header>

      <main style={{ position: 'absolute', top: '58px' }}>
         {children}
      </main>
    </AuthProvider>
  );
}
