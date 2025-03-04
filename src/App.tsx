import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import DashboardPage from './features/main/DashboardPage';
import { ProtectedRoute } from './config/ProtectedRoute';
import { AuthRoute } from './config/AuthRoute';
import { LoginForm } from './features/auth/LoginForm';
import { RegisterForm } from './features/auth/RegisterForm';
import { CreateUserForm } from './features/auth/CreateUserForm';
import Layout from './features/common/Layout';
import './styles/styles.css';
import EventsPage from './features/events/EventsPage';
import TouristSitesPage from './features/touristSites/TouristSitesPage';
import GastronomyPage from './features/gastronomy/GastronomyPage';
import AdminPage from './features/configFeatures/ConfigPage';
import UserManagementManager from './features/auth/userManagement/UserManagementManager';

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
              <Route path="/userManagement" element={<UserManagementManager />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/touristSites" element={<TouristSitesPage />} />
              <Route path="/gastronomy" element={<GastronomyPage />} />
              <Route path="/adminpage" element={<AdminPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};