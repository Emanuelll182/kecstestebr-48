import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingScreen } from './LoadingScreen';
import { AuthForm } from './AuthForm';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

interface AuthPageProps {
  onBack?: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onBack }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const { user, isLoading, isInitialized } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (isInitialized && user) {
      console.log('✅ User already authenticated, redirecting from auth page...');
      if (onBack) {
        onBack();
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [user, isInitialized, onBack, navigate]);

  const handleSuccess = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/', { replace: true });
    }
  };

  const handleBackClick = () => {
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };

  // Show loading screen while auth is initializing
  if (isLoading) {
    return <LoadingScreen message="Inicializando autenticação..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={handleBackClick}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <CardTitle className="text-2xl bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                {isSignUp ? 'Criar Conta' : 'Entrar'}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {isSignUp ? 'Cadastre-se para acessar preços especiais' : 'Acesse sua conta'}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <AuthForm 
            isSignUp={isSignUp} 
            onToggleMode={() => setIsSignUp(!isSignUp)}
            onSuccess={handleSuccess}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;