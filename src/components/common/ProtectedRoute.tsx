import { useAuth } from '../../contexts/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';
import { LoadingScreen } from './LoadingScreen';

export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen />;
  
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};