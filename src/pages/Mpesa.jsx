import React, { useState } from "react";
import api from "../axiosConfig";

const Mpesa = () => {
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Normalize phone to format 2547XXXXXXXX
  const normalizePhone = (input) => {
    let p = input.trim();
    if (p.startsWith("07")) {
      return "254" + p.slice(1);
    }
    if (p.startsWith("+254")) {
      return p.slice(1); // remove plus sign
    }
    if (p.startsWith("254")) {
      return p;
    }
    // fallback: return as-is (may not be valid)
    return p;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!phone || !amount) {
      setMessage({ type: "error", text: "Please enter phone and amount." });
      return;
    }

    const normalizedPhone = normalizePhone(phone);

    // Validate phone number format strictly (Kenyan mobile numbers)
    if (!/^2547\d{8}$/.test(normalizedPhone)) {
      setMessage({
        type: "error",
        text: "Please enter a valid phone number in format 2547XXXXXXXX.",
      });
      return;
    }

    // Validate amount is positive number
    const amountNumber = Number(amount);
    if (isNaN(amountNumber) || amountNumber <= 0) {
      setMessage({
        type: "error",
        text: "Amount must be a positive number.",
      });
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("access"); // get JWT token from storage

      const response = await api.post(
        "mpesa/stk-push/",
        {
          phone: normalizedPhone,
          amount: amountNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage({
        type: "success",
        text:
          response.data?.message ||
          "STK push sent! Check your phone to complete payment.",
      });

      if (response.data?.status === "success") {
        setPhone("");
        setAmount("");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to initiate M-Pesa deposit. Please try again.";

      setMessage({
        type: "error",
        text: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Deposit via M-Pesa</h2>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="phone" className="block font-semibold">
              Phone Number
            </label>
            <input
              id="phone"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 254712345678"
              className="w-full p-2 border rounded-lg"
              autoComplete="tel"
              inputMode="tel"
              maxLength={13}
            />
          </div>

          <div>
            <label htmlFor="amount" className="block font-semibold">
              Amount (KES)
            </label>
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full p-2 border rounded-lg"
              min="1"
              step="1"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : "Deposit Now"}
          </button>
        </form>

        {message && (
          <div
            role="alert"
            aria-live="polite"
            className={`mt-4 p-3 rounded-lg text-center ${
              message.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
};

export default Mpesa;
