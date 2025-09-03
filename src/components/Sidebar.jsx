import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FiUser,
  FiLogOut,
  FiPieChart,
  FiDollarSign,
  FiSettings,
  FiClipboard,
} from "react-icons/fi";

const Sidebar = () => {
  const { user, logoutUser } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: "Loan", path: "/loan", icon: <FiDollarSign /> },
    { name: "Analytics", path: "/analytics", icon: <FiPieChart /> },
    { name: "Loan Calculator", path: "/loan-calculator", icon: <FiClipboard /> },
    { name: "Budget Planner", path: "/budget-planner", icon: <FiSettings /> },
    { name: "Settings", path: "/settings", icon: <FiUser /> },
  ];

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-slate-800 text-white shadow-lg z-40">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold text-blue-400">SmartBank360</h1>
        {user?.username && (
          <p className="text-sm text-gray-300 mt-1">Welcome, {user.username}</p>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2 p-4">
        {navLinks.map(({ name, path, icon }) => (
          <Link
            key={name}
            to={path}
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              isActive(path)
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-slate-700 hover:text-white"
            }`}
          >
            {icon}
            <span>{name}</span>
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="absolute bottom-4 w-full px-4">
        <button
          onClick={logoutUser}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-md bg-red-600 hover:bg-red-700 transition"
        >
          <FiLogOut />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
