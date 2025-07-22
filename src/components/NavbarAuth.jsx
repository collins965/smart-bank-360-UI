// src/components/NavbarAuth.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NavbarAuth = () => {
  const { user, logoutUser } = useAuth();

  const handleLogout = () => {
    console.log("Navbar handleLogout called");
    if (typeof logoutUser === "function") {
      logoutUser();
    } else {
      console.error("logoutUser is not a function");
    }
  };

  return (
    <nav className="text-gray-700 px-4 py-2 shadow-md flex justify-between items-center h-20 bg-white">
      {/* Logo */}
      <Link to="/" className="flex items-center">
        <div className="w-[120px] h-[140px] -ml-4 mt-4">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 400 300"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="150" cy="100" r="80" stroke="#2563EB" strokeWidth="8" fill="none" />
            <circle cx="150" cy="100" r="70" stroke="#2563EB" strokeDasharray="5,5" strokeWidth="4" fill="none" />
            <rect x="115" y="85" width="70" height="40" rx="8" ry="8" fill="none" stroke="#2563EB" strokeWidth="4" />
            <line x1="115" y1="105" x2="185" y2="105" stroke="#2563EB" strokeDasharray="4,4" strokeWidth="3" />
            <circle cx="180" cy="105" r="5" fill="#2563EB" />
            <text x="130" y="80" fontSize="22" fill="#2563EB" fontFamily="Arial" fontWeight="bold">360°</text>
            <path d="M120,60 A30,30 0 0,1 180,60" stroke="#2563EB" strokeWidth="3" fill="none" markerEnd="url(#arrowhead)" />
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#2563EB" />
              </marker>
            </defs>
            <text x="240" y="130" fontSize="24" fill="#2563EB" fontFamily="Arial" fontWeight="bold">SMART</text>
            <text x="230" y="160" fontSize="24" fill="#2563EB" fontFamily="Arial" fontWeight="bold">BANK 360</text>
          </svg>
        </div>
      </Link>

      {/* Navigation Links */}
      <div className="flex items-center space-x-6 text-sm">
        {user ? (
          <>
            <Link to="/wallet" className="hover:text-teal-500 transition">Wallet</Link>
            <Link to="/profile" className="hover:text-teal-500 transition">Profile</Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-blue-600 transition">Login</Link>
            <Link to="/register" className="hover:text-blue-600 transition">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavbarAuth;
