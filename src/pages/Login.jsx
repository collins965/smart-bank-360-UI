import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";

// Reusable Toast Component
const Toast = ({ type, message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bg =
    type === "success"
      ? "bg-green-100 border-green-600 text-green-700"
      : type === "error"
      ? "bg-red-100 border-red-600 text-red-700"
      : "bg-gray-100 border-gray-400 text-gray-800";

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`fixed top-4 right-4 z-50 px-4 py-3 border-l-4 rounded shadow-md text-sm sm:text-base max-w-xs ${bg}`}
    >
      {message}
    </motion.div>
  );
};

const Login = () => {
  const navigate = useNavigate();
  const {
    setAuthTokens,
    setUser,
    setIsAuthenticated,
  } = useAuth();

  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setToast(null);

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/accounts/login/", {
        username: form.username,
        password: form.password,
      });

      const { access, refresh } = res.data;
      const decoded = JSON.parse(atob(access.split('.')[1]));

      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);

      setAuthTokens({ access, refresh });
      setUser(decoded);
      setIsAuthenticated(true);

      setToast({ type: "success", message: "Login successful! Redirecting..." });
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      console.error("Login error:", err);
      setToast({
        type: "error",
        message:
          err.response?.data?.detail || "Invalid credentials or server error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-white to-blue-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
          SmartBank Login
        </h2>

        <AnimatePresence mode="wait">
          {toast && (
            <Toast
              key={toast.message}
              type={toast.type}
              message={toast.message}
              onClose={() => setToast(null)}
            />
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              name="username"
              type="text"
              placeholder="Enter username"
              autoComplete="username"
              value={form.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              name="password"
              type="password"
              placeholder="Enter password"
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-700"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 text-white font-semibold rounded-lg transition-all duration-300 
              ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                Logging in...
              </div>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-600 font-medium hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
