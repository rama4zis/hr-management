'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Box, CircularProgress } from '@mui/material';
import { authService } from '@/services/authService';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      // Check if running in browser environment
      if (typeof window === 'undefined') {
        setLoading(true);
        return;
      }

      // First check localStorage directly for user data
      const storedUser = localStorage.getItem('user');
      let authenticated = false;

      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          // Validate that the stored data has required fields
          if (userData && userData.id && userData.username && userData.employeeId) {
            authenticated = true;
          } else {
            // Clean up invalid data
            localStorage.removeItem('user');
          }
        } catch (error) {
          // Clean up corrupted data
          localStorage.removeItem('user');
        }
      }

      // Also use authService as fallback
      if (!authenticated) {
        authenticated = authService.isAuthenticated();
      }

      setIsAuthenticated(authenticated);
      setLoading(false);

      // If not authenticated and not on login page, redirect to login
      if (!authenticated && pathname !== '/login') {
        router.push('/login');
        return;
      }

      // If authenticated and on login page, redirect to dashboard
      if (authenticated && pathname === '/login') {
        router.push('/employees');
        return;
      }
    };

    checkAuth();
  }, [pathname, router]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // If on login page, always show content
  if (pathname === '/login') {
    return <>{children}</>;
  }

  // For protected routes, only show content if authenticated
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // This shouldn't be reached due to redirect, but just in case
  return null;
}
