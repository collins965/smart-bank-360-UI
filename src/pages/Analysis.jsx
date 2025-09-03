// src/pages/Analysis.jsx
import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import { motion } from "framer-motion";
import { FaChartPie, FaMoneyBillWave, FaWallet, FaExclamationTriangle } from "react-icons/fa";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend);

const currency = (n) => `KES ${Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
const shimmer = "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.6s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent";

const Analysis = () => {
  const [summary, setSummary] = useState({
    totalBalance: 0,
    totalIncome: 0,
    totalExpenses: 0,
  });
  const [chartData, setChartData] = useState({
    labels: [],
    monthlyIncome: [],
    monthlyExpenses: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const [walletRes, historyRes] = await Promise.all([
          axiosInstance.get("accounts/wallet/"),
          axiosInstance.get("accounts/wallet/history/?limit=1000"), // get enough history for analysis
        ]);

        const balance = walletRes.data?.balance || 0;
        const transactions = Array.isArray(historyRes.data?.results) ? historyRes.data.results : [];

        // --- Process data for the last 6 months ---
        const now = new Date();
        const labels = [];
        const incomeByMonth = new Array(6).fill(0);
        const expensesByMonth = new Array(6).fill(0);
        let totalIncome = 0;
        let totalExpenses = 0;

        for (let i = 5; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          labels.push(d.toLocaleString("default", { month: "short" }));
        }

        transactions.forEach((tx) => {
          const txDate = new Date(tx.timestamp);
          const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
          
          if (txDate < sixMonthsAgo) return; // ignore transactions older than 6 months

          const monthDiff = (now.getFullYear() - txDate.getFullYear()) * 12 + (now.getMonth() - txDate.getMonth());
          const index = 5 - monthDiff;
          
          if (index >= 0 && index < 6) {
            const amount = parseFloat(tx.amount) || 0;
            
            if (tx.direction === "received" || String(tx.transaction_type).toLowerCase().includes("top")) {
              incomeByMonth[index] += amount;
              totalIncome += amount;
            } else if (tx.direction === "sent" || String(tx.transaction_type).toLowerCase().includes("withdraw")) {
              expensesByMonth[index] += amount;
              totalExpenses += amount;
            }
          }
        });

        setSummary({ totalBalance: balance, totalIncome, totalExpenses });
        setChartData({
          labels,
          monthlyIncome: incomeByMonth,
          monthlyExpenses: expensesByMonth,
        });

      } catch (err) {
        console.error("Analysis data fetch error:", err);
        setError("Could not load financial analysis. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const barData = {
    labels: chartData.labels,
    datasets: [
      {
        label: "Income",
        data: chartData.monthlyIncome,
        backgroundColor: "#34D399",
        borderRadius: 4,
      },
      {
        label: "Expenses",
        data: chartData.monthlyExpenses,
        backgroundColor: "#F87171",
        borderRadius: 4,
      },
    ],
  };

  const lineData = {
    labels: chartData.labels,
    datasets: [
      {
        label: "Net Flow",
        data: chartData.monthlyIncome.map((inc, i) => inc - chartData.monthlyExpenses[i]),
        fill: false,
        borderColor: "#3B82F6",
        tension: 0.4,
      },
    ],
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top',
        },
    },
    scales: {
        y: {
            beginAtZero: true
        }
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
        <FaExclamationTriangle className="text-5xl text-red-500 mb-4" />
        <h2 className="text-2xl font-semibold mb-2">An Error Occurred</h2>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-10 bg-gray-50 text-gray-800">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          className="text-4xl font-bold mb-10 text-center text-gray-800"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Financial Analysis 📊
        </motion.h2>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <SummaryCard icon={<FaWallet className="text-3xl text-emerald-500" />} title="Total Balance" value={summary.totalBalance} color="text-emerald-600" loading={loading} />
          <SummaryCard icon={<FaMoneyBillWave className="text-3xl text-blue-500" />} title="Total Income (All Time)" value={summary.totalIncome} color="text-blue-600" loading={loading} />
          <SummaryCard icon={<FaChartPie className="text-3xl text-rose-500" />} title="Total Expenses (All Time)" value={summary.totalExpenses} color="text-rose-600" loading={loading} />
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-10">
          <div className="bg-white p-6 rounded-2xl shadow-md border h-[450px]">
            <h4 className="text-lg font-bold mb-4 text-gray-700">Monthly Income vs Expenses</h4>
            {loading ? <div className={`w-full h-full ${shimmer} rounded-lg bg-gray-200`} /> : <Bar data={barData} options={chartOptions} />}
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-md border h-[450px]">
            <h4 className="text-lg font-bold mb-4 text-gray-700">Monthly Net Flow</h4>
            {loading ? <div className={`w-full h-full ${shimmer} rounded-lg bg-gray-200`} /> : <Line data={lineData} options={chartOptions} />}
          </div>
        </div>
      </div>
    </div>
  );
};

const SummaryCard = ({ icon, title, value, color, loading }) => (
  <motion.div
    className={`bg-white rounded-2xl shadow-md p-6 border ${loading ? shimmer : ""}`}
    whileHover={{ scale: 1.03, y: -5 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <div className="flex items-center gap-4">
      {icon}
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h3 className={`text-2xl font-semibold ${color}`}>
          {loading ? <span className="inline-block h-6 w-32 bg-gray-200 rounded" /> : currency(value)}
        </h3>
      </div>
    </div>
  </motion.div>
);

export default Analysis;