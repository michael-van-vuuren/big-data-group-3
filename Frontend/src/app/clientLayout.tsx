'use client';

import { ReactNode, useState } from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import NavigationMenuDemo from '@/components/navigation';
import { logoutUser } from '@/lib/apiClient';
import { Button } from '@/components/ui/button';

function LogoutButton() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logoutUser();
      location.reload();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="right-8 z-50">
      <Button onClick={handleLogout} variant='logout' size='logout' disabled={loading}>
        Logout
      </Button>
    </div>
  );
}

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <header className="flex items-center justify-between px-6 bg-specialBlue grid-bg-light">
        {/* Left side: navigation bar */}
        <NavigationMenuDemo />

        {/* Right side: logout button */}
        <LogoutButton />
      </header>

      <div style={{ position: 'absolute', top: '58px' }}>{children}</div>
    </AuthProvider>
  );
}
