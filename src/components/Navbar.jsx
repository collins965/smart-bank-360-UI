import { Link, NavLink } from "react-router-dom";

const Navbar = () => {
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Services", path: "/services" },
    { name: "Login", path: "/login" },
    { name: "Register", path: "/register" },
  ];

  return (
    <nav className="bg-white shadow-md text-gray-800 px-4 py-3 flex justify-between items-center h-[70px] md:h-[90px]">
      {/* Logo */}
      <Link to="/" className="flex items-center">
        <div className="w-[135px] h-[150px] -ml-4 mt-4"> {/* Increased size and lowered */}
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
            <text x="130" y="80" fontSize="20" fill="#2563EB" fontFamily="Arial" fontWeight="bold">360°</text>
            <path d="M120,60 A30,30 0 0,1 180,60" stroke="#2563EB" strokeWidth="3" fill="none" markerEnd="url(#arrowhead)" />
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#2563EB" />
              </marker>
            </defs>
            <text x="240" y="130" fontSize="22" fill="#2563EB" fontFamily="Arial" fontWeight="bold">SMART</text>
            <text x="230" y="160" fontSize="22" fill="#2563EB" fontFamily="Arial" fontWeight="bold">BANK 360</text>
          </svg>
        </div>
      </Link>

      {/* Navigation Links */}
      <div className="space-x-3 hidden md:flex items-center text-sm mt-4">
        {navLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-md font-medium hover:text-blue-600 transition duration-200 ${
                isActive ? "text-blue-700 underline" : ""
              }`
            }
          >
            {link.name}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
