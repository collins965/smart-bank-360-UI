import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiUser, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Ensure a default admin user exists
    const admins = JSON.parse(localStorage.getItem("sb360-admin-users")) || [];
    if (!admins.some((a) => a.username === "admin")) {
      admins.push({ username: "admin", password: "admin1234" });
      localStorage.setItem("sb360-admin-users", JSON.stringify(admins));
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      setError("Please fill in all fields.");
      return;
    }

    const admins = JSON.parse(localStorage.getItem("sb360-admin-users")) || [];
    const match = admins.find(
      (admin) =>
        admin.username === trimmedUsername &&
        admin.password === trimmedPassword
    );

    if (match) {
      localStorage.setItem("sb360-admin-auth", "true");
      localStorage.setItem("sb360-admin-user", trimmedUsername);
      navigate("/sb360-admin/dashboard");
    } else {
      setError("Invalid username or password.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <motion.form
        onSubmit={handleLogin}
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-gray-900 border border-gray-800 p-8 rounded-2xl shadow-2xl text-gray-100"
      >
        <h2 className="text-3xl font-bold text-center text-indigo-400 mb-6">
          SmartBank360 Admin Login
        </h2>

        <div className="relative mb-4">
          <FiUser className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Admin Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full pl-10 pr-3 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="relative mb-4">
          <FiLock className="absolute left-3 top-3 text-gray-400" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-10 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div
            className="absolute right-3 top-3 text-gray-400 cursor-pointer"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </div>
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-red-500 mb-4 text-center"
          >
            {error}
          </motion.p>
        )}

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition duration-300 shadow-md"
        >
          Login
        </motion.button>
      </motion.form>
    </div>
  );
};

export default AdminLogin;
