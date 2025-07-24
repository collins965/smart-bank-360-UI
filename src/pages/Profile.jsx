import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { motion } from 'framer-motion';
import 'react-toastify/dist/ReactToastify.css';

const Profile = () => {
  const [profile, setProfile] = useState({
    id_number: '',
    phone: '',
    address: '',
    date_of_birth: '',
    bio: '',
    profile_image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/accounts/profile/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access')}`,
        },
      });
      setProfile(response.data);
      setImagePreview(response.data.profile_image);
    } catch (error) {
      toast.error('Failed to load profile.');
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profile_image') {
      const file = files[0];
      setProfile((prev) => ({ ...prev, profile_image: file }));
      setImagePreview(URL.createObjectURL(file));
    } else {
      setProfile((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    Object.entries(profile).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    try {
      await axios.put('http://127.0.0.1:8000/api/accounts/profile/', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile.');
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-xl border"
    >
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">My Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* ID Number */}
        <div>
          <label className="block text-sm font-medium text-gray-600">ID Number</label>
          <input
            type="text"
            name="id_number"
            value={profile.id_number}
            onChange={handleChange}
            className="mt-1 w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter ID number"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-600">Phone</label>
          <input
            type="text"
            name="phone"
            value={profile.phone}
            onChange={handleChange}
            className="mt-1 w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter phone number"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-600">Address</label>
          <input
            type="text"
            name="address"
            value={profile.address}
            onChange={handleChange}
            className="mt-1 w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter address"
          />
        </div>

        {/* DOB */}
        <div>
          <label className="block text-sm font-medium text-gray-600">Date of Birth</label>
          <input
            type="date"
            name="date_of_birth"
            value={profile.date_of_birth}
            onChange={handleChange}
            className="mt-1 w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-gray-600">Bio</label>
          <textarea
            name="bio"
            value={profile.bio}
            onChange={handleChange}
            className="mt-1 w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            placeholder="Tell us about yourself"
          />
        </div>

        {/* Image */}
        <div>
          <label className="block text-sm font-medium text-gray-600">Profile Image</label>
          <input
            type="file"
            name="profile_image"
            accept="image/*"
            onChange={handleChange}
            className="mt-1 block w-full text-sm text-gray-600"
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Profile Preview"
              className="mt-4 h-32 w-32 rounded-full object-cover border"
            />
          )}
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-all duration-300"
          >
            Save Changes
          </button>
        </div>
      </form>
      <ToastContainer position="top-right" autoClose={3000} />
    </motion.div>
  );
};

export default Profile;
