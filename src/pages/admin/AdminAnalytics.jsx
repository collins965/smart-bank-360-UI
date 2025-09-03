import { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { motion } from "framer-motion";
import { FaUsers, FaWallet, FaExchangeAlt } from "react-icons/fa";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get("/api/admin/analytics/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        setAnalytics(res.data);
      } catch (err) {
        console.error("Analytics Error:", err);
        setAnalytics(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const transactionsPerDay = Array.isArray(analytics?.transactions_per_day)
    ? analytics.transactions_per_day
    : [];

  const transactionChartData = {
    labels: transactionsPerDay.map((entry) => entry.date),
    datasets: [
      {
        label: "Transactions",
        data: transactionsPerDay.map((entry) => entry.count),
        backgroundColor: "#6366F1",
        borderRadius: 6,
      },
    ],
  };

  const userStatusChartData = {
    labels: ["Active", "Inactive"],
    datasets: [
      {
        label: "User Status",
        data: [analytics?.active_users || 0, analytics?.inactive_users || 0],
        backgroundColor: ["#10B981", "#EF4444"],
        borderWidth: 1,
      },
    ],
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p className="text-xl animate-pulse">Loading analytics...</p>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p className="text-xl text-red-400">Failed to load analytics data.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-10 min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <motion.h1
        className="text-4xl font-bold text-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Admin Analytics Dashboard
      </motion.h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <motion.div
          className="bg-gray-800 border border-gray-700 rounded-2xl shadow-xl p-6 text-center"
          whileHover={{ scale: 1.05 }}
        >
          <FaUsers className="text-4xl text-indigo-400 mx-auto mb-3" />
          <p className="text-2xl font-bold">{analytics.total_users}</p>
          <p className="text-gray-400">Total Users</p>
        </motion.div>

        <motion.div
          className="bg-gray-800 border border-gray-700 rounded-2xl shadow-xl p-6 text-center"
          whileHover={{ scale: 1.05 }}
        >
          <FaWallet className="text-4xl text-green-400 mx-auto mb-3" />
          <p className="text-2xl font-bold">{analytics.total_wallets}</p>
          <p className="text-gray-400">Total Wallets</p>
        </motion.div>

        <motion.div
          className="bg-gray-800 border border-gray-700 rounded-2xl shadow-xl p-6 text-center"
          whileHover={{ scale: 1.05 }}
        >
          <FaExchangeAlt className="text-4xl text-purple-400 mx-auto mb-3" />
          <p className="text-2xl font-bold">{analytics.total_transactions}</p>
          <p className="text-gray-400">Total Transactions</p>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <motion.div
          className="bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-md"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-lg font-semibold text-gray-300 mb-4">Transactions Per Day</h2>
          <Bar
            data={transactionChartData}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
              },
              scales: {
                x: { ticks: { color: "#ccc" }, grid: { color: "#333" } },
                y: { ticks: { color: "#ccc" }, grid: { color: "#333" } },
              },
            }}
          />
        </motion.div>

        <motion.div
          className="bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-md"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-lg font-semibold text-gray-300 mb-4">User Activity</h2>
          <Pie
            data={userStatusChartData}
            options={{
              plugins: {
                legend: {
                  labels: {
                    color: "#ddd",
                  },
                },
              },
            }}
          />
        </motion.div>
      </div>

      {/* Additional Stats */}
      <div className="mt-10 grid sm:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-5 rounded-2xl border border-gray-700 shadow">
          <h3 className="text-lg font-semibold text-indigo-300 mb-2">Active Users</h3>
          <p className="text-2xl font-bold">{analytics.active_users}</p>
        </div>

        <div className="bg-gray-800 p-5 rounded-2xl border border-gray-700 shadow">
          <h3 className="text-lg font-semibold text-red-300 mb-2">Inactive Users</h3>
          <p className="text-2xl font-bold">{analytics.inactive_users}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
