import { useAuth } from '../../contexts/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';
import { LoadingScreen } from './LoadingScreen';

export const AuthRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen />;
  
  return !isAuthenticated ? <Outlet /> : <Navigate to="/dashboard" replace />;
};