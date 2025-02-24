import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import DashboardPage from './components/main/DashboardPage';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { AuthRoute } from './components/common/AuthRoute';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { CreateUserForm } from './components/auth/CreateUserForm';
import { UserManagement } from './components/auth/UserManagement';
import Layout from './components/common/Layout';
import './styles/styles.css';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginForm />} />

          <Route element={<AuthRoute />}>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/createUser" element={<CreateUserForm />} />
              <Route path="/userManagement" element={<UserManagement />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};