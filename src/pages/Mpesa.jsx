// src/pages/Mpesa.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Mpesa = () => {
  const { axiosInstance } = useAuth();

  const [amount, setAmount] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    const trimmedPhone = phoneNumber.trim();
    const formattedAmount = parseInt(amount, 10);

    try {
      const response = await axiosInstance.post("/api/mpesa/stk-push/", {
        phone: trimmedPhone,
        amount: formattedAmount,
      });

      console.log("📲 STK Push success:", response.data);
      setMessage({ type: "success", text: "Payment initiated successfully." });
    } catch (error) {
      console.error(" STK Push error:", error);
      if (error.response?.data) {
        setMessage({
          type: "error",
          text: ` ${error.response.data.detail || "Error initiating payment."}`,
        });
      } else {
        setMessage({
          type: "error",
          text: " Something went wrong. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white border border-blue-200 rounded-xl shadow-xl">
      <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">M-Pesa Payment</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm text-gray-700 mb-1">Phone Number</label>
          <input
            type="text"
            placeholder="e.g. 254712345678"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
            className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Amount</label>
          <input
            type="number"
            placeholder="e.g. 100"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            min="1"
            className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white font-bold transition duration-300 ${
            loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Processing..." : "Pay via M-Pesa"}
        </button>

        {message.text && (
          <p
            className={`text-center mt-4 text-sm font-medium ${
              message.type === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {message.text}
          </p>
        )}
      </form>
    </div>
  );
};

export default Mpesa;
