import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiLock,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiInfo,
  FiHash,
} from "react-icons/fi";

// Reusable InputField Component
const InputField = ({ name, type, label, icon: Icon, value, onChange, error }) => (
  <div className="mb-4">
    <label className="block text-gray-600 font-medium mb-1">{label}</label>
    <div className="relative">
      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-blue-500">
        <Icon className="text-xl" />
      </span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
      />
    </div>
    {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
  </div>
);

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    idNumber: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    bio: "",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    setSuccessMessage("");
  };

  const validate = () => {
    const newErrors = {};
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/accounts/register/", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        id_number: formData.idNumber,
        phone: formData.phone,
        address: formData.address,
        date_of_birth: formData.dateOfBirth,
        bio: formData.bio,
      });

      if (response.status === 201 || response.status === 200) {
        setSuccessMessage("Registration successful! Redirecting...");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (error) {
      if (error.response?.data) {
        const serverErrors = error.response.data;
        const formatted = {};
        Object.keys(serverErrors).forEach((key) => {
          formatted[key] = serverErrors[key][0];
        });
        setErrors(formatted);
      } else {
        setErrors({ general: "Something went wrong. Try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 p-4">
      <div className="bg-white w-full max-w-lg p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
          Create Your Account
        </h2>
        <form onSubmit={handleSubmit}>
          <InputField
            name="username"
            type="text"
            label="Username"
            icon={FiUser}
            value={formData.username}
            onChange={handleChange}
            error={errors.username}
          />
          <InputField
            name="email"
            type="email"
            label="Email"
            icon={FiMail}
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />
          <InputField
            name="password"
            type="password"
            label="Password"
            icon={FiLock}
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
          />
          <InputField
            name="confirmPassword"
            type="password"
            label="Confirm Password"
            icon={FiLock}
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
          />
          <InputField
            name="idNumber"
            type="text"
            label="ID Number"
            icon={FiHash}
            value={formData.idNumber}
            onChange={handleChange}
            error={errors.idNumber}
          />
          <InputField
            name="phone"
            type="text"
            label="Phone Number"
            icon={FiPhone}
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
          />
          <InputField
            name="address"
            type="text"
            label="Address"
            icon={FiMapPin}
            value={formData.address}
            onChange={handleChange}
            error={errors.address}
          />
          <InputField
            name="dateOfBirth"
            type="date"
            label="Date of Birth"
            icon={FiCalendar}
            value={formData.dateOfBirth}
            onChange={handleChange}
            error={errors.dateOfBirth}
          />

          {/* Bio */}
          <div className="mb-4">
            <label className="block text-gray-600 font-medium mb-1">Bio</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-start text-blue-500 pt-2">
                <FiInfo className="text-xl" />
              </span>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 resize-none h-24"
              />
            </div>
            {errors.bio && <p className="text-sm text-red-500 mt-1">{errors.bio}</p>}
          </div>

          {/* Feedback Messages */}
          {errors.general && <p className="text-sm text-red-500 mb-3">{errors.general}</p>}
          {successMessage && (
            <p className="text-sm text-green-600 mb-3">{successMessage}</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-xl font-semibold transition ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            } flex items-center justify-center`}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 018 8h-4l3 3 3-3h-4a8 8 0 01-8 8v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                  />
                </svg>
                <span>Registering...</span>
              </div>
            ) : (
              "Register"
            )}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-gray-500 mt-4 text-center text-sm">
          Already have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
