// src/components/AuthProvider.tsx
import React, { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (user) {
        navigate('/');
      } else {
        navigate('/sign-in');
      }
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div>Loading...</div>; // You can add a loading spinner here
  }

  return <>{children}</>;
};

export default AuthProvider;
