import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingScreen } from '@/components/Auth/LoadingScreen';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const { isLoading, isInitialized } = useAuth();

  // Show loading screen while auth is initializing
  if (!isInitialized || isLoading) {
    return <LoadingScreen message="Inicializando aplicação..." />;
  }

  return <>{children}</>;
};