import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiLoader } from "react-icons/fi";

const Wallet = () => {
  const [balance, setBalance] = useState(null);
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pinLoading, setPinLoading] = useState(false);
  const [hasPin, setHasPin] = useState(false);
  const [showUpdatePin, setShowUpdatePin] = useState(false);

  const fetchWallet = async () => {
    try {
      const res = await axiosInstance.get("http://127.0.0.1:8000/api/accounts/wallet/");
      setBalance(Number(res.data.balance));
      setHasPin(!!res.data.has_pin);
    } catch (err) {
      console.error("Wallet fetch error:", err);
      toast.error("Failed to load wallet: " + (err.response?.status || err.message));
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await axiosInstance.get("http://127.0.0.1:8000/api/accounts/wallet/history/");
      if (Array.isArray(res.data.results)) {
        setHistory(res.data.results);
      } else {
        console.warn("Unexpected history response:", res.data);
        setHistory([]);
      }
    } catch (err) {
      console.error("History fetch error:", err);
      toast.error("Failed to load history: " + (err.response?.status || err.message));
      setHistory([]);
    }
  };

  const loadData = async () => {
    setLoading(true);
    await Promise.all([fetchWallet(), fetchHistory()]);
    setLoading(false);
  };

  const handlePinSubmit = async (e) => {
    e.preventDefault();
    if (pin.length !== 4 || isNaN(pin)) {
      toast.warning("PIN must be a 4-digit number");
      return;
    }
    if (pin !== confirmPin) {
      toast.error("PINs do not match");
      return;
    }

    try {
      setPinLoading(true);
      await axiosInstance.post("http://127.0.0.1:8000/api/accounts/wallet/set-pin/", { pin });
      toast.success(hasPin ? "PIN updated successfully" : "PIN set successfully");
      setPin("");
      setConfirmPin("");
      setHasPin(true);
      setShowUpdatePin(false);
    } catch (error) {
      const msg = error.response?.data?.detail || "Failed to update PIN";
      toast.error(msg);
    } finally {
      setPinLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-[#edf2f7] to-[#e2e8f0] p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Wallet Balance */}
        <motion.div
          className="bg-white p-6 rounded-2xl shadow-xl"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Wallet Overview</h2>
          {loading ? (
            <div className="flex items-center space-x-2 text-gray-500">
              <FiLoader className="animate-spin text-xl" />
              <span>Loading balance...</span>
            </div>
          ) : (
            <div className="text-4xl font-semibold text-green-600">
              Ksh {typeof balance === "number" ? balance.toFixed(2) : "0.00"}
            </div>
          )}
        </motion.div>

        {/* Set/Update PIN */}
        <motion.div
          className="bg-white p-6 rounded-2xl shadow-xl"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Wallet PIN</h2>

          {hasPin ? (
            <div>
              <button
                onClick={() => setShowUpdatePin((prev) => !prev)}
                className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition"
              >
                {showUpdatePin ? "Cancel" : "Change PIN"}
              </button>

              <AnimatePresence>
                {showUpdatePin && (
                  <motion.form
                    onSubmit={handlePinSubmit}
                    className="space-y-4 mt-6"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  >
                    <div>
                      <label className="block text-gray-600">New 4-digit PIN</label>
                      <input
                        type="password"
                        maxLength={4}
                        className="w-full mt-1 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600">Confirm PIN</label>
                      <input
                        type="password"
                        maxLength={4}
                        className="w-full mt-1 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={confirmPin}
                        onChange={(e) => setConfirmPin(e.target.value)}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={pinLoading}
                      className={`w-full bg-green-600 text-white px-6 py-2 rounded-xl transition hover:bg-green-700 ${
                        pinLoading ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                    >
                      {pinLoading ? "Saving..." : "Update PIN"}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <form onSubmit={handlePinSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-600">Set 4-digit PIN</label>
                <input
                  type="password"
                  maxLength={4}
                  className="w-full mt-1 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-gray-600">Confirm PIN</label>
                <input
                  type="password"
                  maxLength={4}
                  className="w-full mt-1 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value)}
                />
              </div>
              <button
                type="submit"
                disabled={pinLoading}
                className={`w-full bg-blue-600 text-white px-6 py-2 rounded-xl transition hover:bg-blue-700 ${
                  pinLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {pinLoading ? "Saving..." : "Set PIN"}
              </button>
            </form>
          )}
        </motion.div>

        {/* Transaction History */}
        <motion.div
          className="bg-white p-6 rounded-2xl shadow-xl"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Transaction History</h2>
          {loading ? (
            <div className="flex items-center space-x-2 text-gray-500">
              <FiLoader className="animate-spin text-xl" />
              <span>Loading history...</span>
            </div>
          ) : history.length === 0 ? (
            <p className="text-gray-500">No transactions yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="text-left bg-gray-100">
                    <th className="p-3">Type</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((txn) => (
                    <tr key={txn.id} className="border-t hover:bg-gray-50 transition">
                      <td className="p-3 capitalize">{txn.transaction_type}</td>
                      <td className="p-3">Ksh {txn.amount}</td>
                      <td
                        className={`p-3 ${
                          txn.status === "completed" ? "text-green-600" : "text-red-500"
                        }`}
                      >
                        {txn.status}
                      </td>
                      <td className="p-3 text-sm">
                        {new Date(txn.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Wallet;
