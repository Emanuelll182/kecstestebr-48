import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { LoadingScreen } from '@/components/Auth/LoadingScreen';
import AdminDashboard from '@/components/Admin/AdminDashboard';
import { useToast } from '@/hooks/use-toast';

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { canAccess, isLoading } = useAuthGuard({
    requireAuth: true,
    requireAdmin: true,
    onUnauthorized: () => {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para acessar esta área.",
        variant: "destructive",
      });
    }
  });

  if (isLoading) {
    return <LoadingScreen message="Verificando permissões..." />;
  }

  if (!canAccess) {
    return <LoadingScreen message="Redirecionando..." />;
  }

  return <AdminDashboard onBack={() => navigate('/')} />;
};

export default AdminPage;