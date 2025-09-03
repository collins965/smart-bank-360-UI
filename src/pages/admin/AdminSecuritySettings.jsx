// src/pages/AdminSecuritySettings.jsx
import { useState } from "react";
import {
  FiLock,
  FiKey,
  FiShield,
  FiCheckCircle,
  FiAlertTriangle,
  FiMapPin,
  FiClock,
} from "react-icons/fi";
import { motion } from "framer-motion";

const AdminSecuritySettings = () => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [accountLocked, setAccountLocked] = useState(false);

  const loginHistory = [
    { id: 1, date: "2025-07-27", time: "10:15 AM", location: "Nairobi" },
    { id: 2, date: "2025-07-26", time: "08:00 PM", location: "Nairobi" },
    { id: 3, date: "2025-07-25", time: "01:30 PM", location: "Nairobi" },
  ];

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    alert("Password changed successfully (mock)");
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const toggleTwoFA = () => {
    setTwoFAEnabled((prev) => !prev);
  };

  const handleLockAccount = () => {
    setAccountLocked(true);
    alert("Admin account locked (mock)");
  };

  return (
    <motion.div
      className="max-w-5xl mx-auto px-6 py-8 bg-[#0f172a] text-gray-100 rounded-xl mt-6 shadow-lg border border-gray-800 space-y-10"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold flex items-center gap-2 text-indigo-400">
        <FiShield /> Admin Security Settings
      </h2>

      {/* Change Password */}
      <motion.div
        className="bg-[#1e293b] p-6 rounded-lg border border-gray-700 shadow-sm"
        whileHover={{ scale: 1.01 }}
      >
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-indigo-300">
          <FiKey /> Change Password
        </h3>
        <form className="space-y-4" onSubmit={handlePasswordChange}>
          {["currentPassword", "newPassword", "confirmPassword"].map((field, idx) => (
            <input
              key={idx}
              type="password"
              placeholder={field
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (s) => s.toUpperCase())}
              className="w-full px-4 py-2 bg-gray-800 text-gray-100 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={passwordData[field]}
              onChange={(e) =>
                setPasswordData({ ...passwordData, [field]: e.target.value })
              }
            />
          ))}
          <button className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md text-white transition duration-200">
            Change Password
          </button>
        </form>
      </motion.div>

      {/* 2FA */}
      <motion.div
        className="bg-[#1e293b] p-6 rounded-lg border border-gray-700 shadow-sm"
        whileHover={{ scale: 1.01 }}
      >
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-indigo-300">
          <FiLock /> Two-Factor Authentication
        </h3>
        <p className="mb-4 text-sm">
          2FA is currently{" "}
          <span className={`font-bold ${twoFAEnabled ? "text-green-400" : "text-red-500"}`}>
            {twoFAEnabled ? "Enabled" : "Disabled"}
          </span>
        </p>
        <button
          onClick={toggleTwoFA}
          className={`px-4 py-2 rounded-md text-white transition duration-200 ${
            twoFAEnabled ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {twoFAEnabled ? "Disable" : "Enable"} 2FA
        </button>
      </motion.div>

      {/* Login History */}
      <motion.div
        className="bg-[#1e293b] p-6 rounded-lg border border-gray-700 shadow-sm"
        whileHover={{ scale: 1.01 }}
      >
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-indigo-300">
          <FiCheckCircle /> Login History
        </h3>
        <ul className="divide-y divide-gray-600">
          {loginHistory.map((log) => (
            <li
              key={log.id}
              className="py-3 flex justify-between items-center text-sm text-gray-300"
            >
              <span className="flex items-center gap-2">
                <FiClock className="text-indigo-400" />
                {log.date} — {log.time}
              </span>
              <span className="flex items-center gap-2 text-gray-400">
                <FiMapPin /> {log.location}
              </span>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Lock Account */}
      <motion.div
        className="bg-[#1e293b] p-6 rounded-lg border border-gray-700 shadow-sm"
        whileHover={{ scale: 1.01 }}
      >
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-red-400">
          <FiAlertTriangle /> Lock Account
        </h3>
        <p className="text-sm text-gray-400 mb-4">
          This will disable access to your admin account until it is manually unlocked.
        </p>
        <button
          onClick={handleLockAccount}
          disabled={accountLocked}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md disabled:opacity-50 transition"
        >
          {accountLocked ? "Account Locked" : "Lock Account"}
        </button>
      </motion.div>
    </motion.div>
  );
};

export default AdminSecuritySettings;
