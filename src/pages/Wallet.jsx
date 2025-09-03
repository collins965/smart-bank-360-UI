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
  const [currentPin, setCurrentPin] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pinLoading, setPinLoading] = useState(false);
  const [hasPin, setHasPin] = useState(false);
  const [showUpdatePin, setShowUpdatePin] = useState(false);

  // Fetch wallet info
  const fetchWallet = async () => {
    try {
      const res = await axiosInstance.get("accounts/wallet/");
      setBalance(Number(res.data.balance));
      setHasPin(!!res.data.has_pin);
    } catch (err) {
      toast.error("Failed to load wallet");
    }
  };

  // Fetch transaction history
  const fetchHistory = async () => {
    try {
      const res = await axiosInstance.get("accounts/wallet/history/");
      setHistory(Array.isArray(res.data.results) ? res.data.results : []);
    } catch (err) {
      toast.error("Failed to load transaction history");
    }
  };

  const loadData = async () => {
    setLoading(true);
    await Promise.all([fetchWallet(), fetchHistory()]);
    setLoading(false);
  };

  // Handle PIN set/update
  const handlePinSubmit = async (e) => {
    e.preventDefault();

    if (!/^\d{4}$/.test(pin)) {
      toast.warning("PIN must be exactly 4 digits");
      return;
    }
    if (pin !== confirmPin) {
      toast.error("PINs do not match");
      return;
    }
    if (hasPin && !currentPin) {
      toast.error("Current PIN is required to change PIN");
      return;
    }

    try {
      setPinLoading(true);
      const payload = hasPin
        ? { pin, current_pin: currentPin }
        : { pin };

      await axiosInstance.post("accounts/wallet/set-pin/", payload);

      toast.success(hasPin ? "PIN updated successfully" : "PIN set successfully");
      setHasPin(true);
      setPin("");
      setConfirmPin("");
      setCurrentPin("");
      setShowUpdatePin(false);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to set PIN");
    } finally {
      setPinLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-5xl mx-auto space-y-10">

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
              Ksh {balance?.toFixed(2) ?? "0.00"}
            </div>
          )}
        </motion.div>

        {/* PIN Management */}
        <motion.div
          className="bg-white p-6 rounded-2xl shadow-xl"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center justify-between">
            Wallet PIN

            <button
              aria-label={`${showUpdatePin ? "Hide" : "Show"} Change PIN form`}
              onClick={() => setShowUpdatePin((prev) => !prev)}
              className={`relative w-8 h-12 rounded-full cursor-pointer
                ${showUpdatePin ? "bg-blue-600" : "bg-gray-300"} transition-colors duration-300
                flex items-center justify-center`}
            >
              <motion.span
                layout
                className="block w-6 h-6 bg-white rounded-full shadow-md"
                initial={false}
                animate={{ y: showUpdatePin ? 24 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
          </h2>

          {!loading && hasPin ? (
            <AnimatePresence>
              {showUpdatePin && (
                <motion.form
                  onSubmit={handlePinSubmit}
                  className="space-y-4 mt-6"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div>
                    <label className="block text-gray-600">Current 4-digit PIN</label>
                    <input
                      type="password"
                      maxLength={4}
                      value={currentPin}
                      onChange={(e) => setCurrentPin(e.target.value)}
                      className="w-full mt-1 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600">New 4-digit PIN</label>
                    <input
                      type="password"
                      maxLength={4}
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      className="w-full mt-1 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600">Confirm New PIN</label>
                    <input
                      type="password"
                      maxLength={4}
                      value={confirmPin}
                      onChange={(e) => setConfirmPin(e.target.value)}
                      className="w-full mt-1 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={pinLoading}
                    className={`w-full bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition ${
                      pinLoading ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {pinLoading ? "Saving..." : "Update PIN"}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          ) : (
            !loading && (
              <form onSubmit={handlePinSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-600">Set 4-digit PIN</label>
                  <input
                    type="password"
                    maxLength={4}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="w-full mt-1 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-600">Confirm PIN</label>
                  <input
                    type="password"
                    maxLength={4}
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value)}
                    className="w-full mt-1 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={pinLoading}
                  className={`w-full bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition ${
                    pinLoading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {pinLoading ? "Saving..." : "Set PIN"}
                </button>
              </form>
            )
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
                  <tr className="bg-gray-100 text-left">
                    <th className="p-3">Type</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {history.map((txn) => {
                      const isSent = txn.direction === "sent";
                      const typeLabel = isSent ? "Sent" : "Received";
                      const typeColor = isSent ? "text-red-600" : "text-green-600";
                      return (
                        <motion.tr
                          key={txn.id}
                          className="border-t hover:bg-gray-50 transition-transform cursor-pointer"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          whileHover={{ scale: 1.01 }}
                        >
                          <td className={`p-3 font-medium ${typeColor}`}>{typeLabel}</td>
                          <td className={`p-3 ${typeColor}`}>
                            Ksh {Number(txn.amount).toLocaleString()}
                          </td>
                          <td
                            className={`p-3 font-medium ${
                              txn.status === "completed" || txn.status === "success"
                                ? "text-green-700"
                                : "text-red-500"
                            }`}
                          >
                            {txn.status}
                          </td>
                          <td className="p-3 text-sm">
                            {new Date(txn.timestamp).toLocaleString()}
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
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
