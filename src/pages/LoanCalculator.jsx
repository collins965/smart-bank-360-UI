import { useState, useEffect } from "react";
import { FaCalendarAlt, FaTrash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../api/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoanCalculator = () => {
  const [principal, setPrincipal] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [termYears, setTermYears] = useState("");
  const [monthlyPayment, setMonthlyPayment] = useState(null);
  const [totalPayment, setTotalPayment] = useState(null);
  const [totalInterest, setTotalInterest] = useState(null);
  const [payoffDate, setPayoffDate] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [loanHistory, setLoanHistory] = useState([]);

  useEffect(() => {
    fetchLoanHistory();
  }, []);

  const fetchLoanHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await axiosInstance.get("/finance/loans/");
      const data = Array.isArray(res.data)
        ? res.data
        : res.data.results || res.data.loans || [];
      setLoanHistory(data);
    } catch (err) {
      console.error("Error fetching loan history:", err);
      toast.error("Failed to fetch loan history.");
      setLoanHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  const calculateLoan = async () => {
    const P = parseFloat(principal);
    const rMonthly = parseFloat(interestRate) / 100 / 12;
    const n = parseFloat(termYears) * 12;

    if (
      isNaN(P) ||
      isNaN(rMonthly) ||
      isNaN(n) ||
      P <= 0 ||
      interestRate < 0 ||
      termYears <= 0
    ) {
      setError("Please enter valid positive numbers for all fields.");
      resetCalculatedValues();
      return;
    }

    const M =
      rMonthly === 0
        ? P / n
        : (P * rMonthly * Math.pow(1 + rMonthly, n)) /
          (Math.pow(1 + rMonthly, n) - 1);

    const total = M * n;
    const interest = total - P;

    const finalDate = new Date();
    finalDate.setMonth(finalDate.getMonth() + n);
    const formattedDate = finalDate.toLocaleDateString("en-KE", {
      year: "numeric",
      month: "long",
    });

    setError("");
    setMonthlyPayment(M.toFixed(2));
    setTotalPayment(total.toFixed(2));
    setTotalInterest(interest.toFixed(2));
    setPayoffDate(formattedDate);

    await saveLoanToBackend(P, interestRate, termYears);
    fetchLoanHistory();
  };

  const saveLoanToBackend = async (principal, interestRate, termYears) => {
    try {
      setLoading(true);
      const payload = {
        principal,
        interest_rate: interestRate,
        term_years: termYears,
      };
      await axiosInstance.post("/finance/loans/", payload);
      toast.success("Loan calculation saved successfully!");
    } catch (err) {
      console.error("Error saving loan:", err);
      toast.error(err.response?.data?.detail || "Failed to save loan.");
    } finally {
      setLoading(false);
    }
  };

  const deleteLoan = async (loanId) => {
    try {
      await axiosInstance.delete(`/finance/loans/${loanId}/`);
      toast.success("Loan deleted successfully!");
      fetchLoanHistory();
    } catch (err) {
      console.error("Error deleting loan:", err);
      toast.error("Failed to delete loan.");
    }
  };

  const resetCalculator = () => {
    setPrincipal("");
    setInterestRate("");
    setTermYears("");
    resetCalculatedValues();
    setError("");
  };

  const resetCalculatedValues = () => {
    setMonthlyPayment(null);
    setTotalPayment(null);
    setTotalInterest(null);
    setPayoffDate(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-3xl mx-auto mt-10 p-6 bg-gray-100 rounded-3xl shadow-2xl"
    >
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-4xl font-bold text-center mb-8 text-blue-700 tracking-tight">
        Loan Calculator
      </h1>

      {/* Loan Calculator Form */}
      <div className="bg-white p-6 rounded-2xl shadow mb-6">
        <div className="grid grid-cols-1 gap-4 mb-4">
          <InputField
            label="Loan Amount (KES)"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
          />
          <InputField
            label="Interest Rate (%)"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
          />
          <InputField
            label="Loan Term (Years)"
            value={termYears}
            onChange={(e) => setTermYears(e.target.value)}
          />
        </div>

        <div className="flex justify-between gap-2">
          <button
            onClick={calculateLoan}
            disabled={loading}
            className={`flex-1 bg-blue-600 text-white font-semibold rounded-xl px-4 py-3 hover:bg-blue-700 transition transform hover:scale-[1.02] ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Saving..." : "Calculate"}
          </button>
          <button
            onClick={resetCalculator}
            className="flex-1 bg-gray-200 text-gray-800 font-semibold rounded-xl px-4 py-3 hover:bg-gray-300 transition transform hover:scale-[1.02]"
          >
            Reset
          </button>
        </div>

        {error && (
          <p className="mt-3 text-center text-red-600 font-medium">{error}</p>
        )}

        {monthlyPayment && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-6 text-center bg-green-50 rounded-xl p-4 border border-green-100"
          >
            <h2 className="text-xl font-semibold text-green-700">Loan Summary</h2>
            <p className="text-lg font-bold">Monthly: KES {monthlyPayment}</p>
            <p>Total Payment: KES {totalPayment}</p>
            <p>Total Interest: KES {totalInterest}</p>
            <p className="flex justify-center items-center gap-2 text-green-700 mt-2">
              <FaCalendarAlt /> Payoff by: <strong>{payoffDate}</strong>
            </p>
          </motion.div>
        )}
      </div>

      {/* Loan History Section */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-2xl font-semibold text-blue-600 mb-4">
          Loan History
        </h2>

        {historyLoading ? (
          <LoanHistorySkeleton />
        ) : loanHistory.length === 0 ? (
          <p className="text-gray-600 text-center">No loans saved yet.</p>
        ) : (
          <ul className="space-y-3">
            <AnimatePresence>
              {loanHistory.map((loan) => (
                <motion.li
                  key={loan.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="flex justify-between items-center bg-gray-50 p-3 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition"
                >
                  <div>
                    <p className="font-medium">
                      KES {loan.principal} at {loan.interest_rate}% for{" "}
                      {loan.term_years} years
                    </p>
                    <p className="text-sm text-gray-500">
                      Saved on {new Date(loan.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteLoan(loan.id)}
                    className="text-red-600 hover:text-red-800 transition transform hover:scale-110"
                  >
                    <FaTrash size={18} />
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>
    </motion.div>
  );
};

const InputField = ({ label, value, onChange }) => (
  <div>
    <label className="block font-medium mb-1">{label}</label>
    <input
      type="number"
      min="0"
      value={value}
      onChange={onChange}
      placeholder="Enter value"
      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      required
    />
  </div>
);

const LoanHistorySkeleton = () => (
  <ul className="space-y-3">
    {Array.from({ length: 3 }).map((_, idx) => (
      <li
        key={idx}
        className="flex justify-between items-center bg-gray-50 p-3 rounded-xl shadow-sm border border-gray-200 animate-pulse"
      >
        <div className="w-3/4 h-4 bg-gray-300 rounded"></div>
        <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
      </li>
    ))}
  </ul>
);

export default LoanCalculator;
