import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Mpesa = () => {
  const { access, refresh, setAccess } = useAuth();
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const refreshToken = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/token/refresh/", {
        refresh,
      });
      const newAccess = response.data.access;
      setAccess(newAccess);
      localStorage.setItem("accessToken", newAccess);
      return newAccess;
    } catch (err) {
      console.error("Token refresh failed:", err);
      navigate("/login");
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    const makeRequest = async (token) => {
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/api/mpesa/stk-push/",
          {
            phone_number: phone,
            amount: amount,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setMessage("✅ STK Push sent successfully! Check your phone.");
      } catch (err) {
        if (err.response?.status === 401) {
          const newToken = await refreshToken();
          if (newToken) makeRequest(newToken);
        } else {
          console.error(err);
          setError(err.response?.data?.detail || "❌ Transaction failed. Try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    await makeRequest(access);
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow-2xl rounded-xl">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        M-PESA STK Push
      </h2>

      {message && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{message}</div>}
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            placeholder="e.g. 254712345678"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Amount
          </label>
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            min="1"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 font-bold text-white rounded transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </form>
    </div>
  );
};

export default Mpesa;
