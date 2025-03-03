import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Sidebar from "./Sidebar";

const Layout: React.FC = () => {
  const { logout } = useAuth();
  const location = useLocation();

  const showSidebar = ["/dashboard", "/events", "/activities", "/touristSites", "/gastronomy"].includes(location.pathname);

  return (
    <div className="min-h-screen flex overflow-hidden">
      {showSidebar && <Sidebar />}
      <div className={`flex-1 ${showSidebar ? 'ml-64' : ''}`}>
        <nav className="fixed top-0 left-0 right-0 bg-gray-800/90 backdrop-blur-sm border-b border-gray-700/30 z-50">
          <div className="container mx-auto px-4 py-3">
            <div className="flex justify-end space-x-6">
              <Link
                to="/dashboard"
                className="text-white hover:text-gray-300 transition-colors duration-200"
              >
                Pagina principal
              </Link>
              <Link
                to="/createUser"
                className="text-white hover:text-gray-300 transition-colors duration-200"
              >
                Crear Usuario
              </Link>
              <Link
                to="/userManagement"
                className="text-white hover:text-gray-300 transition-colors duration-200"
              >
                Consultar Usuarios
              </Link>
              <span
                onClick={logout}
                className="text-white hover:text-gray-300 cursor-pointer"
              >
                Logout
              </span>
            </div>
          </div>
        </nav>

        <main className="pt-20 pb-8 h-full overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;