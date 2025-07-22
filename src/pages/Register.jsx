import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiUser, FiMail, FiLock, FiPhone,
  FiCalendar, FiMapPin, FiCreditCard, FiImage
} from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    id_number: "",
    phone: "",
    address: "",
    date_of_birth: "",
    bio: "",
    profile_image: null,
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "profile_image") {
      const file = files[0];
      setFormData({ ...formData, profile_image: file });
      setPreview(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.phone.length > 15) {
      toast.error("Phone number must be 15 characters or fewer");
      setLoading(false);
      return;
    }

    try {
      const payload = new FormData();
      payload.append("username", formData.username);
      payload.append("email", formData.email);
      payload.append("password", formData.password);
      payload.append("profile.id_number", formData.id_number);
      payload.append("profile.phone", formData.phone);
      payload.append("profile.address", formData.address);
      payload.append("profile.date_of_birth", formData.date_of_birth);
      payload.append("profile.bio", formData.bio);

      if (formData.profile_image) {
        payload.append("profile.profile_image", formData.profile_image);
      }

      await axios.post("http://localhost:8000/api/accounts/register/", payload, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      toast.success("Registration successful!", {
        onClose: () => navigate("/login"),
        autoClose: 1500,
      });

    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Registration failed. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-slate-100 to-blue-100 flex justify-center items-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 shadow-2xl rounded-xl w-full max-w-2xl animate-fade-in"
        encType="multipart/form-data"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">
          Create Your Account
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input name="username" placeholder="Username" icon={<FiUser />} value={formData.username} onChange={handleChange} />
          <Input name="email" type="email" placeholder="Email" icon={<FiMail />} value={formData.email} onChange={handleChange} />
          <Input name="password" type="password" placeholder="Password" icon={<FiLock />} value={formData.password} onChange={handleChange} />
          <Input name="id_number" placeholder="ID Number" icon={<FiCreditCard />} value={formData.id_number} onChange={handleChange} />
          <Input name="phone" placeholder="Phone" icon={<FiPhone />} value={formData.phone} onChange={handleChange} />
          <Input name="address" placeholder="Address" icon={<FiMapPin />} value={formData.address} onChange={handleChange} />
          <Input name="date_of_birth" type="date" placeholder="Date of Birth" icon={<FiCalendar />} value={formData.date_of_birth} onChange={handleChange} />

          <div className="col-span-2">
            <textarea
              name="bio"
              placeholder="Short Bio"
              value={formData.bio}
              onChange={handleChange}
              rows={3}
              className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div className="col-span-2">
            <label className="flex items-center gap-2 text-sm text-gray-600 mb-1">
              <FiImage className="text-blue-600" />
              Profile Picture (optional)
            </label>
            <input
              type="file"
              name="profile_image"
              accept="image/*"
              onChange={handleChange}
              className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:border file:rounded file:text-sm file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-2 h-24 rounded shadow object-cover"
              />
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition duration-300 font-semibold"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <span
            className="text-blue-600 hover:underline cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
        <ToastContainer />
      </form>
    </div>
  );
};

const Input = ({ name, type = "text", placeholder, value, onChange, icon }) => (
  <div className="flex items-center border px-3 py-2 rounded focus-within:ring-2 focus-within:ring-blue-500 bg-white shadow-sm">
    {icon}
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="ml-2 w-full focus:outline-none text-sm"
      required
    />
  </div>
);

export default Register;
