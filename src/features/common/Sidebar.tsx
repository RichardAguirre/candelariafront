import { Link } from "react-router-dom";

interface SidebarProps {
  isDashboard: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isDashboard }) => {
  return (
    <aside
      className={`w-64 ${
        isDashboard ? "bg-blue-900/70" : "bg-blue-900"
      } text-white flex-shrink-0 fixed top-0 left-0 h-full z-40`}
    >
      <div className="p-4">
        <nav className="mt-12">
          <ul className="space-y-2">
            <li>
              <Link to="/dashboard" className="block py-2 px-4 hover:bg-blue-800 rounded">
                Pagina principal
              </Link>
            </li>
            <li>
              <Link to="/events" className="block py-2 px-4 hover:bg-blue-800 rounded">
                Eventos y actividades
              </Link>
            </li>
            <li>
              <Link to="/touristSites" className="block py-2 px-4 hover:bg-blue-800 rounded">
                Sitios turísticos
              </Link>
            </li>
            <li>
              <Link to="/gastronomy" className="block py-2 px-4 hover:bg-blue-800 rounded">
                Gastronomía
              </Link>
            </li>
            <li>
              <Link to="/hotels" className="block py-2 px-4 hover:bg-blue-800 rounded">
                Hoteles
              </Link>
            </li>
            <li>
              <Link to="/adminpage" className="block py-2 px-4 hover:bg-blue-800 rounded">
                Adminsitrar contenido
              </Link>
            </li>
            <li>
              <Link to="/userManagement" className="block py-2 px-4 hover:bg-blue-800 rounded">
                Adminsitrar usuarios
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;