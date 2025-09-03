import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import { TrashIcon } from "@heroicons/react/24/solid";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState({
    username: "",
    email: "",
    id_number: "",
    phone: "",
    address: "",
    date_of_birth: "",
    profile_image: null,
  });
  const [imagePreview, setImagePreview] = useState("");

  const fetchProfile = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/accounts/profile/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      });

      const data = res.data;

      const username = data.user?.username || data.username || "";
      const email = data.user?.email || data.email || "";

      setProfile({
        username,
        email,
        id_number: data.id_number || "",
        phone: data.phone || "",
        address: data.address || "",
        date_of_birth: data.date_of_birth || "",
        profile_image: data.profile_image || null,
      });

      if (data.profile_image) {
        setImagePreview(data.profile_image);
      } else {
        setImagePreview("");
      }
    } catch (err) {
      toast.error("Failed to fetch profile.");
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile((prev) => ({ ...prev, profile_image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDeleteImage = async () => {
    try {
      await axios.put(
        "http://127.0.0.1:8000/api/accounts/profile/",
        { profile_image: null },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
            "Content-Type": "application/json",
          },
        }
      );
      setProfile((prev) => ({ ...prev, profile_image: null }));
      setImagePreview("");
      toast.success("Profile image deleted.");
    } catch (error) {
      toast.error("Failed to delete profile image.");
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    for (let key in profile) {
      if (key === "profile_image" && profile[key] instanceof File) {
        formData.append(key, profile[key]);
      } else if (key !== "profile_image") {
        formData.append(key, profile[key]);
      }
    }

    try {
      await axios.put("http://127.0.0.1:8000/api/accounts/profile/", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Profile updated!");
      fetchProfile();
    } catch (err) {
      toast.error("Failed to update profile.");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const avatarInitial = profile.username ? profile.username[0].toUpperCase() : "?";

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="max-w-2xl mx-auto mt-10 p-8 bg-white shadow-2xl rounded-3xl border border-gray-200"
    >
      <div className="flex flex-col items-center space-y-4 mb-8">
        {imagePreview ? (
          <motion.img
            src={imagePreview}
            alt="Profile"
            className="h-28 w-28 rounded-full object-cover border-4 border-blue-500 shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          />
        ) : (
          <motion.div
            className="flex items-center justify-center h-28 w-28 rounded-full bg-blue-600 text-white text-4xl font-extrabold shadow-xl select-none"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {avatarInitial}
          </motion.div>
        )}

        <div className="flex space-x-3 items-center">
          <motion.button
            type="button"
            onClick={() => fileInputRef.current.click()}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition"
          >
            Choose Image
          </motion.button>

          {imagePreview && (
            <motion.button
              type="button"
              onClick={handleDeleteImage}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-red-600 hover:text-red-800 focus:outline-none"
              aria-label="Delete Profile Image"
              title="Delete Profile Image"
            >
              <TrashIcon className="h-7 w-7" />
            </motion.button>
          )}
        </div>

        <h2 className="text-4xl font-bold text-gray-800 tracking-wide">My Profile</h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
        encType="multipart/form-data"
        noValidate
      >
        <input
          ref={fileInputRef}
          type="file"
          name="profile_image"
          onChange={handleImageChange}
          accept="image/*"
          className="hidden"
        />

        {[
          { label: "Username", name: "username", type: "text" },
          { label: "Email", name: "email", type: "email" },
          { label: "ID Number", name: "id_number", type: "text" },
          { label: "Phone", name: "phone", type: "text" },
          { label: "Address", name: "address", type: "text" },
          { label: "Date of Birth", name: "date_of_birth", type: "date" },
        ].map(({ label, name, type }) => (
          <motion.div
            key={name}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 * (name.length) }}
          >
            <label
              htmlFor={name}
              className="block mb-1 text-sm font-semibold text-gray-700"
            >
              {label}
            </label>
            <input
              id={name}
              type={type}
              name={name}
              value={profile[name] || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder={`Enter ${label.toLowerCase()}`}
              autoComplete={name === "email" ? "email" : "off"}
              spellCheck="false"
            />
          </motion.div>
        ))}

        <motion.div className="text-center pt-6">
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl shadow-lg font-semibold tracking-wide transition duration-300"
          >
            Save Changes
          </motion.button>
        </motion.div>
      </form>

      <ToastContainer position="top-right" autoClose={3000} />
    </motion.div>
  );
};

export default Profile;
