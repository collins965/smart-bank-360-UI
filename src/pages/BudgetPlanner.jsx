import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Pie } from "react-chartjs-2";
import { saveAs } from "file-saver";
import axiosInstance from "../api/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Trash2 } from "lucide-react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

// ---------- helpers ----------
const toNum = (v) => {
  const n = Number.parseFloat(v);
  return Number.isFinite(n) ? n : 0;
};

const formatKES = (n) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);

// ---------- component ----------
const BudgetPlanner = () => {
  const [monthlyBudget, setMonthlyBudget] = useState(0);
  const [income, setIncome] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [filter, setFilter] = useState("all");
  const [formData, setFormData] = useState({
    type: "income",
    amount: "",
    category: "",
  });
  const [loading, setLoading] = useState(true);
  const [entryLoading, setEntryLoading] = useState(false);

  const API_ENDPOINT = "/finance/budget/";

  // Fetch all budget entries
  const fetchBudget = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(API_ENDPOINT);
      const allData = Array.isArray(res.data?.results) ? res.data.results : [];
      setIncome(allData.filter((e) => e.type === "income"));
      setExpenses(allData.filter((e) => e.type === "expense"));
    } catch (err) {
      toast.error("Failed to fetch budget data");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudget();
  }, []);

  // Add income or expense
  const handleAdd = async () => {
    const amount = toNum(formData.amount);
    const category = (formData.category || "").trim();

    if (!amount || amount <= 0 || !category) {
      toast.warning("Please enter a valid amount and category");
      return;
    }

    const entry = { ...formData, amount, category };
    try {
      setEntryLoading(true);
      await axiosInstance.post(API_ENDPOINT, entry);
      toast.success(
        `${formData.type === "income" ? "Income" : "Expense"} added successfully`
      );
      setFormData({ type: "income", amount: "", category: "" });
      fetchBudget(); // refresh list
    } catch (err) {
      toast.error("Failed to add entry");
      console.error("Add error:", err);
    } finally {
      setEntryLoading(false);
    }
  };

  // Delete an entry
  const deleteEntry = async (id) => {
    try {
      await axiosInstance.delete(`${API_ENDPOINT}${id}/`);
      toast.success("Entry deleted successfully");
      fetchBudget(); // refresh list
    } catch (err) {
      toast.error("Failed to delete entry");
      console.error("Delete error:", err);
    }
  };

  // Totals (always coerce to number!)
  const totalIncome = useMemo(
    () => income.reduce((sum, i) => sum + toNum(i.amount), 0),
    [income]
  );
  const totalExpenses = useMemo(
    () => expenses.reduce((sum, e) => sum + toNum(e.amount), 0),
    [expenses]
  );
  const balance = (toNum(monthlyBudget) || 0) + totalIncome - totalExpenses;

  // Progress calculations
  const budgetCap = (toNum(monthlyBudget) || 0) + totalIncome; // how much you can spend this month
  const incomePct =
    toNum(monthlyBudget) > 0
      ? Math.min(100, (totalIncome / toNum(monthlyBudget)) * 100)
      : totalIncome > 0
      ? 100
      : 0;
  const expensePct =
    budgetCap > 0 ? Math.min(100, (totalExpenses / budgetCap) * 100) : 0;
  const remaining = Math.max(0, budgetCap - totalExpenses);
  const balancePct = budgetCap > 0 ? (remaining / budgetCap) * 100 : 0;

  // Pie chart data
  const filteredExpenses =
    filter === "all" ? expenses : expenses.filter((e) => e.category === filter);
  const categories = [...new Set(filteredExpenses.map((e) => e.category))];
  const pieData = {
    labels: categories,
    datasets: [
      {
        label: "Expenses",
        data: categories.map((cat) =>
          filteredExpenses
            .filter((e) => e.category === cat)
            .reduce((sum, e) => sum + toNum(e.amount), 0)
        ),
        backgroundColor: [
          "#f87171",
          "#fbbf24",
          "#60a5fa",
          "#34d399",
          "#c084fc",
          "#f472b6",
          "#fb923c",
          "#2dd4bf",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Export CSV
  const handleExport = () => {
    const rows = [
      ["Type", "Category", "Amount"],
      ...income.map((i) => ["Income", i.category, toNum(i.amount).toFixed(2)]),
      ...expenses.map((e) => ["Expense", e.category, toNum(e.amount).toFixed(2)]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    saveAs(
      new Blob([csv], { type: "text/csv;charset=utf-8" }),
      "budget-data.csv"
    );
  };

  // Small reusable progress bar
  const Progress = ({ pct, color = "bg-indigo-500" }) => (
    <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
      <motion.div
        className={`h-2 ${color}`}
        initial={{ width: 0 }}
        animate={{ width: `${Math.max(0, Math.min(100, pct)).toFixed(1)}%` }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
      />
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-5xl mx-auto p-6 bg-white rounded-2xl shadow-lg mt-8 space-y-6"
    >
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-3xl font-bold text-center text-indigo-600">
        Smart Budget Planner
      </h2>

      {/* Entry Form */}
      <motion.div
        initial={{ scale: 0.98 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.25 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <div className="p-4 border rounded-2xl shadow-sm">
          <label className="block mb-2 font-medium">Monthly Budget</label>
          <input
            type="number"
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={monthlyBudget}
            onChange={(e) => setMonthlyBudget(toNum(e.target.value))}
            placeholder="e.g. 100000"
          />
          <p className="mt-2 text-sm text-gray-500">
            Current: <span className="font-semibold">{formatKES(toNum(monthlyBudget))}</span>
          </p>
        </div>

        <div className="p-4 border rounded-2xl space-y-2 shadow-sm">
          <label className="block font-medium">Add Entry</label>
          <select
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <input
            type="number"
            placeholder="Amount"
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          />
          <input
            type="text"
            placeholder="Category"
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          />
          <button
            onClick={handleAdd}
            disabled={entryLoading}
            className={`w-full bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700 transition ${
              entryLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {entryLoading ? "Adding..." : "Add Entry"}
          </button>
        </div>
      </motion.div>

      {/* Summary Cards with progress bars */}
      <div className="grid md:grid-cols-3 gap-4">
        <motion.div
          whileHover={{ y: -2 }}
          className="p-4 rounded-2xl border shadow-sm bg-gradient-to-b from-green-50 to-white"
        >
          <p className="text-sm text-gray-600">Total Income</p>
          <p className="text-2xl font-bold text-green-700 tracking-tight">
            {formatKES(totalIncome)}
          </p>
          <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
            <span>Progress vs Budget</span>
            <span>{incomePct.toFixed(1)}%</span>
          </div>
          <div className="mt-1.5">
            <Progress pct={incomePct} color="bg-green-500" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="p-4 rounded-2xl border shadow-sm bg-gradient-to-b from-rose-50 to-white"
        >
          <p className="text-sm text-gray-600">Total Expenses</p>
          <p className="text-2xl font-bold text-rose-700 tracking-tight">
            {formatKES(totalExpenses)}
          </p>
          <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
            <span>Used of Available</span>
            <span>{expensePct.toFixed(1)}%</span>
          </div>
          <div className="mt-1.5">
            <Progress pct={expensePct} color="bg-rose-500" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="p-4 rounded-2xl border shadow-sm bg-gradient-to-b from-indigo-50 to-white"
        >
          <p className="text-sm text-gray-600">Balance</p>
          <p className="text-2xl font-bold text-indigo-700 tracking-tight">
            {formatKES(balance)}
          </p>
          <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
            <span>Remaining</span>
            <span>{balancePct.toFixed(1)}%</span>
          </div>
          <div className="mt-1.5">
            <Progress pct={balancePct} color="bg-indigo-500" />
          </div>
        </motion.div>
      </div>

      {/* Expense Breakdown */}
      <div className="p-4 border rounded-2xl bg-gray-50 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <h3 className="text-xl font-semibold">Expense Breakdown</h3>
          <div className="flex gap-2 w-full sm:w-auto">
            <select
              className="p-2 border rounded-lg w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              {[...new Set(expenses.map((e) => e.category))].map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <button
              onClick={handleExport}
              className="bg-emerald-500 text-white px-3 py-2 rounded-xl hover:bg-emerald-600 transition"
            >
              Export CSV
            </button>
          </div>
        </div>

        {filteredExpenses.length > 0 ? (
          <div className="relative w-full max-w-[280px] h-[260px] mx-auto">
            <Pie
              data={pieData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  title: {
                    display: true,
                    text: "Expense Distribution",
                    font: { size: 14 },
                  },
                  legend: {
                    position: "bottom",
                    labels: { font: { size: 11 }, boxWidth: 12, usePointStyle: true },
                  },
                  tooltip: {
                    callbacks: {
                      label: (ctx) =>
                        `${ctx.label}: ${formatKES(toNum(ctx.raw))}`,
                    },
                  },
                },
              }}
            />
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-6">
            No expenses to display.
          </p>
        )}
      </div>

      {/* Budget Entries List */}
      <div className="p-4 border rounded-2xl bg-white space-y-3 shadow-sm">
        <h3 className="text-xl font-semibold">Budget Entries</h3>
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : income.length === 0 && expenses.length === 0 ? (
          <p className="text-center text-gray-500">
            No budget entries saved yet.
          </p>
        ) : (
          [...income, ...expenses]
            .sort(
              (a, b) =>
                new Date(b.created_at || 0) - new Date(a.created_at || 0)
            )
            .map((entry) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-between items-center p-3 border rounded-xl hover:bg-gray-50 transition"
              >
                <div className="flex-1">
                  <p className="font-medium">
                    <span
                      className={`mr-2 px-2 py-0.5 rounded-full text-xs ${
                        entry.type === "income"
                          ? "bg-green-100 text-green-700"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {entry.type.toUpperCase()}
                    </span>
                    {entry.category}
                  </p>
                  <p className="text-sm text-gray-600 mt-0.5">
                    {formatKES(toNum(entry.amount))}{" "}
                    {entry.created_at && (
                      <span className="text-gray-400">
                        • {new Date(entry.created_at).toLocaleDateString()}
                      </span>
                    )}
                  </p>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => deleteEntry(entry.id)}
                  className="p-2 rounded-full bg-red-100 hover:bg-red-200 transition ml-3"
                  title="Delete entry"
                >
                  <Trash2 size={18} className="text-red-600" />
                </motion.button>
              </motion.div>
            ))
        )}
      </div>
    </motion.div>
  );
};

export default BudgetPlanner;
