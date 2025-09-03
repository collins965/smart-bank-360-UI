// src/components/NavbarAuth.jsx
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiX, FiUser, FiGrid } from "react-icons/fi";
import { Bell } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Sidebar from "./Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../api/axiosInstance"; // Handles JWT automatically

const NavbarAuth = () => {
  const { logoutUser } = useAuth();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef();

  const toggleSidebar = () => setSidebarVisible((prev) => !prev);
  const toggleDropdown = () => setDropdownOpen((prev) => !prev);
  const toggleMobileNav = () => setMobileNavOpen((prev) => !prev);

  // Fetch unread notifications count on ultra-fast interval
  useEffect(() => {
    let active = true;

    const fetchUnreadNotifications = async () => {
      try {
        const { data } = await axiosInstance.get("/user/notifications/");
        const count = data.results
          ? data.results.filter((n) => !n.is_read).length
          : data.unread_count ?? 0;
        if (active) setUnreadCount(count);
      } catch (error) {
        if (active) setUnreadCount(0);
        console.error("Error fetching notifications:", error);
      }
    };

    fetchUnreadNotifications();
    const interval = setInterval(fetchUnreadNotifications, 200); // 0.2 second refresh
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    if (typeof logoutUser === "function") logoutUser();
  };

  return (
    <>
      {/* Navbar */}
      <nav className="px-6 py-2 shadow-md flex justify-between items-center h-20 bg-white/90 backdrop-blur border-b relative z-30">
        {/* Left section */}
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleSidebar}
            className="text-blue-600 hover:text-blue-800 text-2xl transition"
          >
            {sidebarVisible ? <FiX /> : <FiGrid />}
          </motion.button>

          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="w-[120px] h-[140px] -ml-4 mt-4">
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 400 300"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="150"
                  cy="100"
                  r="80"
                  stroke="#2563EB"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="150"
                  cy="100"
                  r="70"
                  stroke="#2563EB"
                  strokeDasharray="5,5"
                  strokeWidth="4"
                  fill="none"
                />
                <rect
                  x="115"
                  y="85"
                  width="70"
                  height="40"
                  rx="8"
                  ry="8"
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="4"
                />
                <line
                  x1="115"
                  y1="105"
                  x2="185"
                  y2="105"
                  stroke="#2563EB"
                  strokeDasharray="4,4"
                  strokeWidth="3"
                />
                <circle cx="180" cy="105" r="5" fill="#2563EB" />
                <text
                  x="130"
                  y="80"
                  fontSize="22"
                  fill="#2563EB"
                  fontFamily="Arial"
                  fontWeight="bold"
                >
                  360°
                </text>
                <path
                  d="M120,60 A30,30 0 0,1 180,60"
                  stroke="#2563EB"
                  strokeWidth="3"
                  fill="none"
                  markerEnd="url(#arrowhead)"
                />
                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="7"
                    refX="0"
                    refY="3.5"
                    orient="auto"
                  >
                    <polygon points="0 0, 10 3.5, 0 7" fill="#2563EB" />
                  </marker>
                </defs>
                <text
                  x="240"
                  y="130"
                  fontSize="24"
                  fill="#2563EB"
                  fontFamily="Arial"
                  fontWeight="bold"
                >
                  SMART
                </text>
                <text
                  x="230"
                  y="160"
                  fontSize="24"
                  fill="#2563EB"
                  fontFamily="Arial"
                  fontWeight="bold"
                >
                  BANK 360
                </text>
              </svg>
            </div>
          </Link>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-4">
          {/* Desktop navigation */}
          <div className="hidden md:flex gap-6 text-sm font-medium items-center">
            <Link to="/wallet" className="hover:text-blue-600 transition">
              Wallet
            </Link>
            <Link to="/notifications" className="relative group">
              <Bell className="w-5 h-5 text-blue-600 group-hover:text-blue-800 transition" />
              {unreadCount > 0 && (
                <motion.span
                  className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {unreadCount}
                </motion.span>
              )}
            </Link>
            <Link to="/send-money" className="hover:text-blue-600 transition">
              Send
            </Link>
          </div>

          {/* Mobile nav toggle */}
          <div className="md:hidden">
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleMobileNav}
              className="text-blue-600 hover:text-blue-800 text-2xl transition"
            >
              {mobileNavOpen ? <FiX /> : <FiGrid />}
            </motion.button>
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleDropdown}
              className="text-xl text-blue-700 hover:text-blue-900"
            >
              <FiUser />
            </motion.button>
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="absolute right-0 mt-2 w-40 bg-white/90 backdrop-blur-md border rounded-md shadow-xl z-50"
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
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarVisible && (
          <>
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 260, damping: 25 }}
              className="fixed inset-y-0 left-0 z-40 w-64 bg-slate-800 text-white shadow-2xl"
            >
              <Sidebar onClose={toggleSidebar} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black z-30"
              onClick={toggleSidebar}
            />
          </>
        )}
      </AnimatePresence>

      {/* Mobile Nav Dropdown */}
      <AnimatePresence>
        {mobileNavOpen && (
          <motion.div
            initial={{ x: 300 }}
            animate={{ x: 0 }}
            exit={{ x: 300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-24 right-4 z-50 w-48 bg-white/90 backdrop-blur-md shadow-lg rounded-lg p-4 md:hidden"
          >
            <Link
              to="/wallet"
              onClick={() => setMobileNavOpen(false)}
              className="block mb-3 text-gray-800 hover:text-blue-600 font-medium"
            >
              Wallet
            </Link>
            <Link
              to="/notifications"
              onClick={() => setMobileNavOpen(false)}
              className="block mb-3 text-gray-800 hover:text-blue-600 font-medium"
            >
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 text-xs font-bold text-red-500">
                  ({unreadCount})
                </span>
              )}
            </Link>
            <Link
              to="/send-money"
              onClick={() => setMobileNavOpen(false)}
              className="block mb-3 text-gray-800 hover:text-blue-600 font-medium"
            >
              Send
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavbarAuth;
