import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface UseAuthGuardOptions {
  requireAuth?: boolean;
  requireAdmin?: boolean;
  redirectTo?: string;
  onUnauthorized?: () => void;
}

export const useAuthGuard = ({
  requireAuth = false,
  requireAdmin = false,
  redirectTo,
  onUnauthorized,
}: UseAuthGuardOptions = {}) => {
  const { user, profile, isLoading, isInitialized } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Don't do anything while still loading or not initialized
    if (isLoading || !isInitialized) {
      return;
    }

    // Check authentication requirement
    if (requireAuth && !user) {
      console.log('🚫 Authentication required, redirecting to login');
      const redirect = redirectTo || '/auth';
      navigate(redirect, { 
        state: { from: location.pathname },
        replace: true 
      });
      return;
    }

    // Check admin requirement
    if (requireAdmin) {
      if (!user) {
        console.log('🚫 Admin access requires authentication, redirecting to login');
        navigate('/auth', { 
          state: { from: location.pathname },
          replace: true 
        });
        return;
      }

      // Wait for profile to load if user exists but profile is null
      if (user && profile === null) {
        console.log('⏳ Waiting for profile to load...');
        return;
      }

      // Check if user is admin
      if (user && profile && !profile.is_admin) {
        console.log('🚫 Admin access denied, user is not admin');
        if (onUnauthorized) {
          onUnauthorized();
        } else {
          navigate('/', { replace: true });
        }
        return;
      }

      // Check if user is blocked
      if (user && profile && profile.is_blocked) {
        console.log('🚫 User is blocked');
        if (onUnauthorized) {
          onUnauthorized();
        } else {
          navigate('/', { replace: true });
        }
        return;
      }
    }

    // If user is authenticated and trying to access auth pages, redirect to home
    if (user && location.pathname === '/auth') {
      console.log('✅ User already authenticated, redirecting from auth page');
      const from = (location.state as any)?.from || '/';
      navigate(from, { replace: true });
    }
  }, [
    user,
    profile,
    isLoading,
    isInitialized,
    requireAuth,
    requireAdmin,
    redirectTo,
    onUnauthorized,
    navigate,
    location
  ]);

  return {
    isAuthenticated: !!user,
    isAdmin: !!(user && profile?.is_admin && !profile?.is_blocked),
    isBlocked: !!(profile?.is_blocked),
    isLoading: isLoading || !isInitialized,
    canAccess: (() => {
      if (isLoading || !isInitialized) return false;
      if (requireAuth && !user) return false;
      if (requireAdmin && (!user || !profile?.is_admin || profile?.is_blocked)) return false;
      return true;
    })(),
  };
};

export { useAuth };
