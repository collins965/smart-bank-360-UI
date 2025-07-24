import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX, FiUser } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const NavbarAuth = () => {
  const { user, logoutUser } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  const handleLogout = () => {
    if (typeof logoutUser === "function") logoutUser();
    else console.error("logoutUser is not a function");
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const dropdownMenu = (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-50"
    >
      <Link
        to="/profile"
        className="block px-4 py-2 text-sm hover:bg-blue-100"
        onClick={() => setDropdownOpen(false)}
      >
        Profile
      </Link>
      <button
        onClick={handleLogout}
        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
      >
        Logout
      </button>
    </motion.div>
  );

  return (
    <>
      {/* Top Navbar */}
      <nav className="text-gray-700 px-4 py-2 shadow-md flex justify-between items-center h-20 bg-white relative z-20">
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

        {/* Right Side */}
        <div className="flex items-center gap-6">
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6 text-sm relative">
            <Link to="/wallet" className="hover:text-teal-600 transition">Wallet</Link>
            <Link to="/send-money" className="hover:text-teal-600 transition">Send</Link>

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="text-xl text-blue-700 hover:text-blue-900 focus:outline-none"
              >
                <FiUser />
              </button>

              <AnimatePresence>
                {dropdownOpen && dropdownMenu}
              </AnimatePresence>
            </div>
          </div>

          {/* Sidebar Toggle for Mobile */}
          <button
            onClick={toggleSidebar}
            className="text-blue-600 hover:text-blue-800 text-2xl focus:outline-none md:hidden"
          >
            {sidebarOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-64 bg-white shadow-2xl z-40 p-4 md:hidden"
          >
            <div className="flex justify-between items-center border-b pb-2 mb-4">
              <h2 className="text-lg font-bold text-blue-700">Menu</h2>
              <button onClick={toggleSidebar} className="text-gray-700 text-2xl">
                <FiX />
              </button>
            </div>
            <div className="flex flex-col space-y-4 text-gray-700">
              <Link to="/wallet" onClick={toggleSidebar} className="hover:text-blue-600">Wallet</Link>
              <Link to="/send-money" onClick={toggleSidebar} className="hover:text-blue-600">Send Money</Link>

              {/* Profile Dropdown in Sidebar */}
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center gap-2 hover:text-blue-600 text-left"
                >
                  <FiUser className="text-xl" />
                  Profile
                </button>
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="mt-2 ml-6 bg-white border rounded shadow z-40 w-36"
                    >
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm hover:bg-blue-100"
                        onClick={() => {
                          setDropdownOpen(false);
                          toggleSidebar();
                        }}
                      >
                        Profile
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          toggleSidebar();
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default NavbarAuth;
