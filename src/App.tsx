import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DashboardPage } from './pages/DashboardPage';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { AuthRoute } from './components/common/AuthRoute';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { UserManagement } from './components/auth/UserManagement';
import { LoadingScreen } from './components/common/LoadingScreen';
import './styles/styles.css';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoadingScreen />} />

          <Route element={<AuthRoute />}>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/create-user" element={<UserManagement />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};