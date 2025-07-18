import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiLock } from "react-icons/fi";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/api/accounts/register/", form);
      alert("Registration successful! You can now log in.");
      navigate("/login");
    } catch (err) {
      console.error(err.response?.data);
      setError("Registration failed. Check your input or username.");
    }
  };

  return (
    <section className="max-w-md mx-auto mt-20 bg-white shadow-lg p-8 rounded-xl">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Create an Account</h2>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex items-center border rounded px-3 py-2">
          <FiUser className="text-gray-500 mr-2" />
          <input
            name="username"
            placeholder="Username"
            className="w-full outline-none"
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex items-center border rounded px-3 py-2">
          <FiMail className="text-gray-500 mr-2" />
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="w-full outline-none"
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex items-center border rounded px-3 py-2">
          <FiLock className="text-gray-500 mr-2" />
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full outline-none"
            onChange={handleChange}
            required
          />
        </div>

        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded transition duration-300">
          Register
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-4">
        Already have an account?{" "}
        <span
          className="text-green-600 hover:underline cursor-pointer"
          onClick={() => navigate("/login")}
        >
          Login here
        </span>
      </p>
    </section>
  );
};

export default Register;
