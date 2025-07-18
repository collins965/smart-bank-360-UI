import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/accounts/login/", form);
      const { access, refresh } = res.data;
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);
      setSuccess("Login successful! Redirecting...");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setError("Invalid username or password.");
      console.error(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-white to-blue-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
          SmartBank Login
        </h2>

        {error && (
          <p className="text-red-500 text-center text-sm mb-4">{error}</p>
        )}

        {success && (
          <p className="text-green-600 text-center text-sm mb-4 font-medium">
            {success}
          </p>
        )}

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
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                >
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
          <a
            href="/register"
            className="text-blue-600 font-medium hover:underline"
          >
            Register here
          </a>
        </p>
      </div>
    </section>
  );
};

export default Login;
