// src/pages/SendMoney.jsx
import { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SendMoney = () => {
  const [formData, setFormData] = useState({
    recipient: "",
    amount: "",
    pin: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosInstance.post("/api/transfer/", formData);
      toast.success(" Money sent successfully!");
      setFormData({ recipient: "", amount: "", pin: "" });
    } catch (err) {
      const message =
        err?.response?.data?.detail || " Transfer failed. Try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-10 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Send Money</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Recipient Username</label>
          <input
            type="text"
            name="recipient"
            value={formData.recipient}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Amount (KSh)</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            min="1"
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Transfer PIN</label>
          <input
            type="password"
            name="pin"
            value={formData.pin}
            onChange={handleChange}
            required
            maxLength="4"
            minLength="4"
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 text-white rounded transition ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Processing..." : "Send Money"}
        </button>
      </form>
    </div>
  );
};

export default SendMoney;
