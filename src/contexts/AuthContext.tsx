import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<{ success: boolean; error?: string }>;
  clearError: () => void;
  refetchProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    profile: null,
    isLoading: true,
    isInitialized: false,
    error: null,
  });

  // Fetch user profile with retry logic
  const fetchProfile = useCallback(async (userId: string): Promise<Profile | null> => {
    let retries = 3;
    while (retries > 0) {
      try {
        console.log(`🔍 Fetching profile for user: ${userId} (${retries} retries left)`);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (error) {
          console.error('Profile fetch error:', error);
          if (error.code === 'PGRST116') {
            // Profile doesn't exist - this is expected for new users
            console.log('📝 Profile not found - will be created by trigger');
            return null;
          }
          throw error;
        }

        console.log('✅ Profile fetched successfully:', data);
        return data;
      } catch (error) {
        retries--;
        console.error(`❌ Profile fetch attempt failed:`, error);
        
        if (retries > 0) {
          console.log(`🔄 Retrying in 1 second... (${retries} retries left)`);
          await new Promise(resolve => setTimeout(resolve, 1000));
        } else {
          console.error('❌ All profile fetch attempts failed');
          return null;
        }
      }
    }
    return null;
  }, []);

  // Update state helper
  const updateState = useCallback((updates: Partial<AuthState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  // Initialize authentication
  const initializeAuth = useCallback(async () => {
    try {
      console.log('🚀 Initializing authentication...');
      updateState({ isLoading: true, error: null });

      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error('❌ Session initialization error:', error);
        throw error;
      }

      console.log('📋 Session state:', session ? 'Active' : 'None');

      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        updateState({
          user: session.user,
          session,
          profile,
          isLoading: false,
          isInitialized: true,
          error: null,
        });
      } else {
        updateState({
          user: null,
          session: null,
          profile: null,
          isLoading: false,
          isInitialized: true,
          error: null,
        });
      }
    } catch (error) {
      console.error('❌ Auth initialization failed:', error);
      updateState({
        user: null,
        session: null,
        profile: null,
        isLoading: false,
        isInitialized: true,
        error: error instanceof Error ? error.message : 'Failed to initialize authentication',
      });
    }
  }, [fetchProfile, updateState]);

  // Handle auth state changes
  const handleAuthStateChange = useCallback(async (event: string, session: Session | null) => {
    try {
      console.log(`🔄 Auth state changed: ${event}`, session ? 'Session exists' : 'No session');
      
      if (event === 'SIGNED_OUT' || !session) {
        updateState({
          user: null,
          session: null,
          profile: null,
          isLoading: false,
          error: null,
        });
        return;
      }

      if (event === 'SIGNED_IN' && session?.user) {
        updateState({ isLoading: true });
        
        // Wait a bit for the profile trigger to create the record
        if (event === 'SIGNED_IN') {
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
        
        const profile = await fetchProfile(session.user.id);
        updateState({
          user: session.user,
          session,
          profile,
          isLoading: false,
          error: null,
        });
      } else if (event === 'TOKEN_REFRESHED' && session?.user) {
        updateState({
          user: session.user,
          session,
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      console.error('❌ Error in auth state change handler:', error);
      updateState({
        isLoading: false,
        error: 'Erro ao processar mudança de autenticação',
      });
    }
  }, [fetchProfile, updateState]);

  // Set up auth listener
  useEffect(() => {
    let mounted = true;
    let initPromise: Promise<void> | null = null;

    // Initialize auth on mount
    const init = async () => {
      if (!mounted) return;
      if (initPromise) return initPromise;
      
      initPromise = initializeAuth();
      return initPromise;
    };

    init();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (mounted && state.isInitialized) {
          await handleAuthStateChange(event, session);
        }
      }
    );

    return () => {
      mounted = false;
      initPromise = null;
      subscription.unsubscribe();
      console.log('🧹 Auth listener cleaned up');
    };
  }, []); // Empty dependency array to prevent re-initialization

  // Auth methods
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      console.log('🔐 Starting sign in...');
      updateState({ isLoading: true, error: null });

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        console.error('❌ Sign in error:', error);
        let errorMessage = 'Erro ao fazer login';
        
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Email ou senha incorretos';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Por favor, confirme seu email antes de fazer login';
        } else if (error.message.includes('Too many requests')) {
          errorMessage = 'Muitas tentativas. Tente novamente em alguns minutos';
        }
        
        updateState({ isLoading: false, error: errorMessage });
        return { success: false, error: errorMessage };
      }

      console.log('✅ Sign in successful');
      return { success: true };
    } catch (error) {
      console.error('❌ Sign in failed:', error);
      const errorMessage = 'Erro inesperado ao fazer login';
      updateState({ isLoading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  }, [updateState]);

  const signUp = useCallback(async (email: string, password: string, phone?: string) => {
    try {
      console.log('📝 Starting sign up...');
      updateState({ isLoading: true, error: null });

      if (password.length < 6) {
        const errorMessage = 'A senha deve ter pelo menos 6 caracteres';
        updateState({ isLoading: false, error: errorMessage });
        return { success: false, error: errorMessage };
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            setor: 'varejo',
            phone: phone?.trim() || '',
          },
        },
      });

      if (error) {
        console.error('❌ Sign up error:', error);
        let errorMessage = 'Erro ao criar conta';
        
        if (error.message.includes('User already registered')) {
          errorMessage = 'Este email já está cadastrado';
        } else if (error.message.includes('Password should be at least')) {
          errorMessage = 'A senha deve ter pelo menos 6 caracteres';
        } else if (error.message.includes('Invalid email')) {
          errorMessage = 'Email inválido';
        }
        
        updateState({ isLoading: false, error: errorMessage });
        return { success: false, error: errorMessage };
      }

      updateState({ isLoading: false });
      console.log('✅ Sign up successful');
      return { success: true };
    } catch (error) {
      console.error('❌ Sign up failed:', error);
      const errorMessage = 'Erro inesperado ao criar conta';
      updateState({ isLoading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  }, [updateState]);

  const signInWithGoogle = useCallback(async () => {
    try {
      console.log('🔍 Starting Google sign in...');
      updateState({ isLoading: true, error: null });

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        console.error('❌ Google sign in error:', error);
        const errorMessage = 'Erro ao fazer login com Google';
        updateState({ isLoading: false, error: errorMessage });
        return { success: false, error: errorMessage };
      }

      console.log('✅ Google sign in initiated');
      return { success: true };
    } catch (error) {
      console.error('❌ Google sign in failed:', error);
      const errorMessage = 'Erro inesperado ao fazer login com Google';
      updateState({ isLoading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  }, [updateState]);

  const signOut = useCallback(async () => {
    try {
      console.log('🚪 Starting sign out...');
      updateState({ isLoading: true, error: null });

      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('❌ Sign out error:', error);
        const errorMessage = 'Erro ao fazer logout';
        updateState({ isLoading: false, error: errorMessage });
        return { success: false, error: errorMessage };
      }

      console.log('✅ Sign out successful');
      // State will be updated by the auth state change listener
      return { success: true };
    } catch (error) {
      console.error('❌ Sign out failed:', error);
      const errorMessage = 'Erro inesperado ao fazer logout';
      updateState({ isLoading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  }, [updateState]);

  const clearError = useCallback(() => {
    updateState({ error: null });
  }, [updateState]);

  const refetchProfile = useCallback(async () => {
    if (state.user) {
      console.log('🔄 Refetching profile...');
      const profile = await fetchProfile(state.user.id);
      updateState({ profile });
    }
  }, [state.user, fetchProfile, updateState]);

  const contextValue: AuthContextType = {
    ...state,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    clearError,
    refetchProfile,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};