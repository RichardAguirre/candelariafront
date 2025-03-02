import { Link } from "react-router-dom";

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-gray-800 text-white flex-shrink-0 fixed h-full">
      {" "}
      <div className="p-4">
        <h2 className="text-xl font-semibold">Menu</h2>
        <nav className="mt-4">
          <ul className="space-y-2">
            <li>
              <Link
                to="/dashboard"
                className="block py-2 px-4 hover:bg-gray-700 rounded"
              >
                Pagina principal
              </Link>
            </li>
            <li>
              <Link
                to="/events"
                className="block py-2 px-4 hover:bg-gray-700 rounded"
              >
                Eventos y actividades
              </Link>
            </li>
            <li>
              <Link
                to="/touristSites"
                className="block py-2 px-4 hover:bg-gray-700 rounded"
              >
                Sitios turísticos
              </Link>
            </li>
            <li>
              <Link
                to="/gastronomy"
                className="block py-2 px-4 hover:bg-gray-700 rounded"
              >
                Gastronomía
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
