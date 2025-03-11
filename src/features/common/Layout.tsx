import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Sidebar from "./Sidebar";
import logo from "../../assets/Logo_Login.jpg";
import { useEffect, useRef, useState } from "react";

const Layout: React.FC = () => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const showSidebar = [
    "/events",
    "/activities",
    "/touristSites",
    "/gastronomy",
    "/hotels",
    "/adminpage",
    "/userManagement",
  ].includes(location.pathname);

  const isDashboard = location.pathname === "/dashboard";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      {showSidebar && <Sidebar isDashboard={isDashboard} />}
      <div className={`flex-1 ${showSidebar ? "ml-64" : ""}`}>
        <nav
          className={`fixed top-0 left-0 right-0 ${
            isDashboard ? "bg-blue-900/70" : "bg-blue-900"
          } backdrop-blur-sm border-b border-gray-700/30 z-50`}
        >
          <div className="container mx-auto px-4 py-3 flex justify-end items-center w-full">
            <div className="flex items-center space-x-4">
              <span className="text-white">{user?.username}</span>
              <div className="relative" ref={menuRef}>
                <img
                  src={logo}
                  alt="User Logo"
                  className="w-8 h-8 rounded-full cursor-pointer"
                  onClick={() => setShowMenu(!showMenu)}
                />
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 z-50 bg-gray-800">
                    <button
                      onClick={() => {
                        logout();
                        setShowMenu(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
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