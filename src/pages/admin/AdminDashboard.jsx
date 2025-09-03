// src/pages/AdminDashboard.jsx
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiUsers,
  FiDollarSign,
  FiLogOut,
  FiPlus,
  FiTrendingUp,
  FiSettings,
  FiActivity,
  FiShield,
  FiBarChart2,
} from "react-icons/fi";

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("sb360-admin-auth");
    if (!isAuthenticated) {
      navigate("/sb360-admin");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("sb360-admin-auth");
    navigate("/sb360-admin");
  };

  return (
    <div className="flex min-h-screen bg-gray-950 text-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 p-6 hidden md:flex flex-col shadow-xl">
        <h2 className="text-2xl font-bold text-indigo-400 mb-8">SmartBank360</h2>
        <nav className="flex flex-col gap-5 text-sm font-medium">
          <Link to="/sb360-admin/users" className="flex items-center gap-3 hover:text-indigo-300">
            <FiUsers /> Manage Users
          </Link>
          <Link to="/sb360-admin/transactions" className="flex items-center gap-3 hover:text-indigo-300">
            <FiDollarSign /> Transactions
          </Link>
          <Link to="/sb360-admin/add-admin" className="flex items-center gap-3 hover:text-indigo-300">
            <FiPlus /> Add Admin
          </Link>
          <Link to="/sb360-admin/analytics" className="flex items-center gap-3 hover:text-indigo-300">
            <FiBarChart2 /> Analytics
          </Link>
          <Link to="/sb360-admin/security-settings" className="flex items-center gap-3 hover:text-indigo-300">
            <FiShield /> Security Settings
          </Link>
          <Link to="/sb360-admin/logs" className="flex items-center gap-3 hover:text-indigo-300">
            <FiActivity /> Logs
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-red-400 mt-auto hover:text-red-300 transition"
          >
            <FiLogOut /> Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 px-6 py-8 overflow-y-auto bg-gray-950">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-extrabold text-white mb-1">Admin Dashboard</h1>
          <p className="text-gray-400 mb-10">
            Welcome back! Manage and monitor your banking system below.
          </p>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {[
              {
                icon: <FiUsers className="text-indigo-400 text-3xl" />,
                title: "Total Users",
                value: "6 registered",
              },
              {
                icon: <FiDollarSign className="text-green-400 text-3xl" />,
                title: "Transaction Volume",
                value: "KES 0",
              },
              {
                icon: <FiTrendingUp className="text-pink-400 text-3xl" />,
                title: "Growth Rate",
                value: "0%",
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.03 }}
                className="bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-800"
              >
                <div className="mb-3">{card.icon}</div>
                <h3 className="text-xl font-semibold">{card.title}</h3>
                <p className="text-gray-400">{card.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-900 p-6 rounded-2xl shadow-xl border border-gray-800 mb-10">
            <h2 className="text-xl font-semibold text-indigo-300 mb-5">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link
                to="/sb360-admin/users"
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-center py-2 rounded-lg transition"
              >
                View All Users
              </Link>
              <Link
                to="/sb360-admin/add-admin"
                className="bg-green-600 hover:bg-green-700 text-white text-center py-2 rounded-lg transition"
              >
                Add New Admin
              </Link>
              <Link
                to="/sb360-admin/transactions"
                className="bg-yellow-500 hover:bg-yellow-600 text-white text-center py-2 rounded-lg transition"
              >
                View Transactions
              </Link>
              <Link
                to="/sb360-admin/security-settings"
                className="bg-purple-600 hover:bg-purple-700 text-white text-center py-2 rounded-lg transition"
              >
                Security Settings
              </Link>
              <Link
                to="/sb360-admin/logs"
                className="bg-blue-600 hover:bg-blue-700 text-white text-center py-2 rounded-lg transition"
              >
                View Logs
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white text-center py-2 rounded-lg transition"
              >
                Logout
              </button>
            </div>
          </div>

          {/* System Overview */}
          <div className="bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-800">
            <h2 className="text-xl font-semibold text-indigo-300 mb-3">System Health</h2>
            <div className="text-gray-400 space-y-2">
              <p>Status: <span className="text-green-400">All Systems Operational</span></p>
              <p>Uptime: 99.982%</p>
              <p>Last check: 2 mins ago</p>
              <p className="text-sm text-gray-500 italic">Monitoring integrations launching soon</p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default AdminDashboard;
