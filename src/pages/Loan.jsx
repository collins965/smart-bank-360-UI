import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import {
  FiSend,
  FiDollarSign,
  FiCalendar,
  FiInfo,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import * as Tooltip from "@radix-ui/react-tooltip";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

// Ensure the API base URL always ends with /loans/
const RAW_API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
const API_BASE = RAW_API_URL.replace(/\/$/, "") + "/loans/";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("access")}`,
  "Content-Type": "application/json",
});

const Loan = () => {
  const [formData, setFormData] = useState({ amount: "", duration: "" });
  const [loading, setLoading] = useState(false);
  const [showRequirements, setShowRequirements] = useState(false);
  const [showPendingLoans, setShowPendingLoans] = useState(false);
  const [pendingLoans, setPendingLoans] = useState([]);
  const [repayingId, setRepayingId] = useState(null);
  const [totalBorrowed, setTotalBorrowed] = useState(0);

  // Axios instance with token refresh logic
  const api = axios.create({
    baseURL: API_BASE,
    withCredentials: true,
  });

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401 && localStorage.getItem("refresh")) {
        try {
          const refreshRes = await axios.post(
            RAW_API_URL.replace(/\/$/, "") + "/accounts/token/refresh/",
            { refresh: localStorage.getItem("refresh") }
          );
          localStorage.setItem("access", refreshRes.data.access);
          error.config.headers["Authorization"] = `Bearer ${refreshRes.data.access}`;
          return api.request(error.config);
        } catch {
          toast.error("Session expired. Please log in again.");
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
        }
      }
      return Promise.reject(error);
    }
  );

  // Fetch pending loans
  const fetchLoans = async () => {
    try {
      const res = await api.get("", { headers: getAuthHeaders() });
      if (Array.isArray(res.data)) {
        const approvedLoans = res.data.filter((loan) => loan.status === "approved");
        setPendingLoans(approvedLoans);
        setTotalBorrowed(
          approvedLoans.reduce((sum, loan) => sum + Number(loan.amount || 0), 0)
        );
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (err) {
      console.error("Error fetching loans:", err);
      toast.error(err.response?.status === 401 ? "Unauthorized. Please log in." : "Failed to fetch loans.");
      setPendingLoans([]);
      setTotalBorrowed(0);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.duration) {
      toast.error("Please fill in all fields.");
      return;
    }
    try {
      setLoading(true);
      await api.post("apply/", formData, { headers: getAuthHeaders() });
      toast.success("Loan approved and credited to your wallet!");
      setFormData({ amount: "", duration: "" });
      fetchLoans();
    } catch (err) {
      console.error("Loan application error:", err);
      toast.error(err.response?.data?.detail || "Loan request failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleRepay = async (loanId) => {
    try {
      setRepayingId(loanId);
      await api.post(`repay/${loanId}/`, {}, { headers: getAuthHeaders() });
      toast.success("Loan repaid successfully.");
      fetchLoans();
    } catch (err) {
      console.error("Loan repayment error:", err);
      toast.error(err.response?.data?.detail || "Loan repayment failed.");
    } finally {
      setRepayingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-50 p-4 sm:p-10 text-gray-800">
      {/* Total borrowed */}
      <div className="mb-4 text-right">
        <span className="bg-blue-600 text-white px-4 py-2 rounded-full shadow">
          Total Borrowed: KES {totalBorrowed.toLocaleString()}
        </span>
      </div>

      {/* Loan Application Card */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl mx-auto bg-white shadow-2xl rounded-3xl p-8 border border-blue-100"
      >
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-2">
          Apply for a Loan
        </h2>

        {/* Toggle Requirements */}
        <motion.button
          onClick={() => setShowRequirements((prev) => !prev)}
          className="w-full text-sm font-medium text-blue-700 border border-blue-200 bg-blue-50 px-4 py-2 rounded-lg mb-4 flex justify-between items-center hover:bg-blue-100"
          whileTap={{ scale: 0.97 }}
        >
          {showRequirements ? "Hide Requirements" : "View Requirements"}
          {showRequirements ? <FiChevronUp /> : <FiChevronDown />}
        </motion.button>

        <AnimatePresence>
          {showRequirements && (
            <motion.div
              className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              <ul className="list-disc list-inside space-y-1">
                <li>Loan amount ≥ KES 100</li>
                <li>Duration ≥ 1 month</li>
                <li>Active wallet & PIN</li>
                <li>No unpaid active loan</li>
                <li>Wallet balance ≥ 20% of loan requested</li>
                <li>Account not frozen</li>
                <li>Account age ≥ 3 months</li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loan Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Amount */}
          <div>
            <label className="text-sm font-medium flex items-center gap-1 mb-1">
              Loan Amount (KES)
              <Tooltip.Provider>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <span>
                      <FiInfo className="text-blue-500 cursor-pointer" />
                    </span>
                  </Tooltip.Trigger>
                  <Tooltip.Content side="top" className="bg-white border px-3 py-1 rounded-md text-xs">
                    Minimum: KES 100
                  </Tooltip.Content>
                </Tooltip.Root>
              </Tooltip.Provider>
            </label>
            <div className="flex items-center bg-gray-100 rounded-xl px-3">
              <FiDollarSign className="text-gray-400 mr-2" />
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="e.g. 5000"
                className="w-full bg-transparent py-2 outline-none"
                min="100"
              />
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="text-sm font-medium flex items-center gap-1 mb-1">
              Duration (Months)
              <Tooltip.Provider>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <span>
                      <FiInfo className="text-blue-500 cursor-pointer" />
                    </span>
                  </Tooltip.Trigger>
                  <Tooltip.Content side="top" className="bg-white border px-3 py-1 rounded-md text-xs">
                    At least 1 month
                  </Tooltip.Content>
                </Tooltip.Root>
              </Tooltip.Provider>
            </label>
            <div className="flex items-center bg-gray-100 rounded-xl px-3">
              <FiCalendar className="text-gray-400 mr-2" />
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="e.g. 6"
                className="w-full bg-transparent py-2 outline-none"
                min="1"
              />
            </div>
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold shadow-md disabled:opacity-50"
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.02 }}
          >
            {loading ? (
              <motion.div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Submit Loan Request <FiSend />
              </>
            )}
          </motion.button>
        </form>
      </motion.div>

      {/* Pending Loans */}
      <motion.div className="max-w-xl mx-auto mt-6">
        <motion.button
          onClick={() => setShowPendingLoans((prev) => !prev)}
          className="w-full text-sm font-medium text-blue-700 border border-blue-200 bg-blue-50 px-4 py-2 rounded-lg flex justify-between items-center hover:bg-blue-100"
          whileTap={{ scale: 0.97 }}
        >
          {showPendingLoans ? "Hide Pending Loans" : "View Pending Loans"}
          {showPendingLoans ? <FiChevronUp /> : <FiChevronDown />}
        </motion.button>

        <AnimatePresence>
          {showPendingLoans && (
            <motion.div
              className="mt-4 bg-white rounded-xl shadow border border-blue-100"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              {pendingLoans.length === 0 ? (
                <p className="p-4 text-gray-500">No pending loans.</p>
              ) : (
                pendingLoans.map((loan) => (
                  <div key={loan.id} className="flex justify-between items-center p-4 border-b last:border-none">
                    <div>
                      <p className="font-semibold">KES {Number(loan.amount).toLocaleString()}</p>
                      <p className="text-xs text-gray-500">
                        Due: {new Date(loan.repayment_date).toLocaleDateString()}
                      </p>
                    </div>
                    <motion.button
                      onClick={() => handleRepay(loan.id)}
                      disabled={repayingId === loan.id}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                      whileTap={{ scale: 0.97 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      {repayingId === loan.id ? "Processing..." : "Pay Now"}
                    </motion.button>
                  </div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Loan;
