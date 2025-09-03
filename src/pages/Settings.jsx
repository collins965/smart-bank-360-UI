import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { FiBell, FiLock } from "react-icons/fi";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const Settings = () => {
  const { setUser } = useAuth();

  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
    profile_image: null,
  });

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Fetch profile from backend
  const fetchUserProfile = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/accounts/profile/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      });

      const data = res.data;
      const username = data.user?.username || data.username || "";
      const email = data.user?.email || data.email || "";
      const profile_image = data.profile_image || null;

      setProfileData({ username, email, profile_image });

      if (setUser) {
        setUser((prev) => ({
          ...prev,
          username,
          email,
          profile_image,
        }));
      }
    } catch (error) {
      toast.error("Failed to load profile data.");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const avatarInitial = profileData.username
    ? profileData.username[0].toUpperCase()
    : "?";

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = formData;

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    setIsChangingPassword(true);
    try {
      await axios.post(
        "http://127.0.0.1:8000/api/accounts/change-password/",
        {
          current_password: currentPassword,
          new_password: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Password updated successfully!");
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowChangePassword(false);
    } catch (error) {
      const errMsg =
        error.response?.data?.detail ||
        Object.values(error.response?.data || {}).flat().join(" ") ||
        "Failed to update password.";
      toast.error(errMsg);
      console.error(error);
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen px-4 py-10 bg-gradient-to-br from-white via-blue-50 to-blue-100 text-gray-800"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl p-6 sm:p-10 border border-blue-100"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-700">
          Settings
        </h2>

        {/* Profile Avatar */}
        <div className="flex items-center gap-4 mb-6">
          {profileData.profile_image ? (
            <motion.img
              key={profileData.profile_image}
              src={profileData.profile_image}
              alt="Profile"
              className="w-14 h-14 rounded-full object-cover shadow-md border-2 border-blue-600"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
            />
          ) : (
            <motion.div
              className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center shadow-lg text-white text-2xl font-semibold select-none"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {avatarInitial}
            </motion.div>
          )}

          <div>
            <motion.p
              className="text-lg font-semibold"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {profileData.username || "User"}
            </motion.p>
            <motion.p
              className="text-sm text-gray-500"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {profileData.email || "No email provided"}
            </motion.p>
          </div>
        </div>

        {/* Settings Toggles */}
        <div className="space-y-6">
          <SettingToggle
            label="Email Notifications"
            icon={<FiBell className="text-blue-600" />}
            enabled={emailNotifications}
            onToggle={() => setEmailNotifications((prev) => !prev)}
          />

          <SettingToggle
            label="Change Password"
            icon={<FiLock className="text-blue-600" />}
            enabled={showChangePassword}
            onToggle={() => setShowChangePassword((prev) => !prev)}
          />

          {showChangePassword && (
            <motion.form
              onSubmit={handlePasswordChange}
              className="mt-4 space-y-4 bg-blue-50 rounded-xl p-6 border border-blue-100"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Input
                label="Current Password"
                type="password"
                value={formData.currentPassword}
                onChange={(e) =>
                  setFormData({ ...formData, currentPassword: e.target.value })
                }
              />
              <Input
                label="New Password"
                type="password"
                value={formData.newPassword}
                onChange={(e) =>
                  setFormData({ ...formData, newPassword: e.target.value })
                }
              />
              <Input
                label="Confirm New Password"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
              />
              <motion.button
                type="submit"
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: isChangingPassword ? 1 : 1.02 }}
                disabled={isChangingPassword}
                className={`w-full flex items-center justify-center gap-2 ${
                  isChangingPassword
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white py-3 rounded-lg font-semibold transition shadow-lg`}
              >
                {isChangingPassword && (
                  <motion.div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {isChangingPassword ? "Updating..." : "Update Password"}
              </motion.button>
            </motion.form>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-10 select-none">
          More features coming soon...
        </p>
      </motion.div>

      <ToastContainer position="top-right" autoClose={3000} />
    </motion.div>
  );
};

const SettingToggle = ({ label, icon, enabled, onToggle }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <span className="text-blue-700 text-xl">{icon}</span>
      <span className="text-md font-medium">{label}</span>
    </div>
    <button
      onClick={onToggle}
      className={`relative inline-flex items-center h-6 w-11 transition-colors duration-300 focus:outline-none rounded-full ${
        enabled ? "bg-blue-600" : "bg-gray-300"
      }`}
      aria-pressed={enabled}
      aria-label={label}
    >
      <span
        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  </div>
);

const Input = ({ label, ...props }) => (
  <div>
    <label className="block mb-1 text-sm text-gray-600">{label}</label>
    <input
      {...props}
      required
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
    />
  </div>
);

export default Settings;
