import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthPage from '@/components/Auth/AuthPage';

const AuthPageRoute: React.FC = () => {
  const navigate = useNavigate();

  return <AuthPage onBack={() => navigate('/')} />;
};

export default AuthPageRoute;