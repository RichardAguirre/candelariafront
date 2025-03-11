import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LoadingScreen } from '../features/common/LoadingScreen';

export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <LoadingScreen />;

  return isAuthenticated
    ? <Outlet />
    : <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />;
};