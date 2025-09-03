import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiSend, FiPhone, FiDollarSign, FiLock } from "react-icons/fi";
import axiosInstance from "../api/axiosInstance"; // JWT axios instance

const WithdrawMpesa = () => {
  const [formData, setFormData] = useState({
    phone: "",
    amount: "",
    pin: "",
  });

  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load balance from wallet
  const fetchWallet = async () => {
    try {
      const res = await axiosInstance.get("accounts/wallet/");
      setBalance(Number(res.data.balance));
    } catch (err) {
      toast.error("Failed to load wallet balance");
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  const validatePhone = (phone) => /^(\+254|0)?7\d{8}$/.test(phone);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { phone, amount, pin } = formData;

    if (!phone || !amount || !pin) {
      toast.error("All fields are required");
      return;
    }

    if (!validatePhone(phone)) {
      toast.error("Invalid M-Pesa number");
      return;
    }

    if (parseFloat(amount) > balance) {
      toast.error("Insufficient wallet balance");
      return;
    }

    if (!/^\d{4}$/.test(pin)) {
      toast.error("Enter a valid 4-digit PIN");
      return;
    }

    try {
      setLoading(true);
      await axiosInstance.post("mpesa/withdraw/", { phone, amount, pin });

      toast.success("Withdrawal sent to M-Pesa!");
      setFormData({ phone: "", amount: "", pin: "" });

      // Update wallet after withdrawal
      fetchWallet();
    } catch (err) {
      toast.error(
        err.response?.data?.detail || "Withdrawal failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-white px-4 py-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="bg-white border border-gray-200 rounded-xl shadow-xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-4">
          Withdraw to M-Pesa
        </h2>

        <div className="bg-gray-100 p-3 rounded-md mb-6 text-center text-lg font-semibold text-gray-800">
          Wallet Balance:{" "}
          <span className="text-green-600">
            {balance !== null ? `KES ${balance.toLocaleString()}` : "Loading..."}
          </span>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <div className="flex items-center border rounded-md px-3 py-2 mt-1">
              <FiPhone className="text-gray-400 mr-2" />
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="0712345678"
                className="w-full outline-none bg-transparent"
              />
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Amount (KES)
            </label>
            <div className="flex items-center border rounded-md px-3 py-2 mt-1">
              <FiDollarSign className="text-gray-400 mr-2" />
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="Enter amount"
                className="w-full outline-none bg-transparent"
              />
            </div>
          </div>

          {/* PIN */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              4-Digit Transfer PIN
            </label>
            <div className="flex items-center border rounded-md px-3 py-2 mt-1">
              <FiLock className="text-gray-400 mr-2" />
              <input
                type="password"
                name="pin"
                value={formData.pin}
                onChange={handleChange}
                placeholder="****"
                maxLength={4}
                className="w-full outline-none bg-transparent"
              />
            </div>
          </div>

          {/* Submit */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            disabled={loading || balance === null}
            type="submit"
            className={`w-full ${
              loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
            } text-white font-semibold py-2 px-4 rounded-lg transition duration-300 flex justify-center items-center gap-2`}
          >
            {loading ? "Processing..." : "Withdraw Now"} <FiSend />
          </motion.button>
        </form>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </motion.div>
  );
};

export default WithdrawMpesa;
