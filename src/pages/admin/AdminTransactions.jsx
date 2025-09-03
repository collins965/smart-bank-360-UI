// src/pages/AdminTransactions.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FaFilter,
  FaSearch,
  FaSortAmountUp,
  FaSortAmountDown,
} from "react-icons/fa";

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortAsc, setSortAsc] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get("/api/admin/transactions/");
      const data = Array.isArray(res.data) ? res.data : res.data.transactions || [];
      setTransactions(data);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setTransactions([]);
    }
  };

  const filteredTransactions = transactions
    .filter((txn) => {
      const matchType = filterType === "all" || txn.type === filterType;
      const matchStatus = statusFilter === "all" || txn.status === statusFilter;
      const matchSearch =
        txn.sender?.toLowerCase().includes(search.toLowerCase()) ||
        txn.receiver?.toLowerCase().includes(search.toLowerCase());
      return matchType && matchStatus && matchSearch;
    })
    .sort((a, b) => {
      const aVal = sortBy === "amount" ? a.amount : new Date(a.timestamp);
      const bVal = sortBy === "amount" ? b.amount : new Date(b.timestamp);
      return sortAsc ? aVal - bVal : bVal - aVal;
    });

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 px-4 py-10">
      <motion.h1
        className="text-4xl font-bold text-center mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Admin Transactions
      </motion.h1>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded-lg">
            <FaFilter className="text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-transparent text-white outline-none"
            >
              <option value="all">All Types</option>
              <option value="credit">Credit</option>
              <option value="debit">Debit</option>
              <option value="transfer">Transfer</option>
              <option value="top-up">Top-up</option>
              <option value="withdraw">Withdraw</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded-lg">
            <FaFilter className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-white outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="success">Success</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        <div className="flex items-center bg-gray-800 px-3 py-2 rounded-lg w-full lg:w-1/3">
          <FaSearch className="text-gray-400" />
          <input
            type="text"
            placeholder="Search sender or receiver"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent outline-none text-white ml-2"
          />
        </div>
      </div>

      {/* Sort Controls */}
      <div className="flex justify-end items-center gap-4 mb-4">
        <button
          onClick={() => {
            setSortBy("date");
            setSortAsc(!sortAsc);
          }}
          className="flex items-center gap-2 text-sm bg-gray-800 px-3 py-1.5 rounded-md hover:bg-gray-700 transition"
        >
          {sortBy === "date" && sortAsc ? <FaSortAmountUp /> : <FaSortAmountDown />}
          Sort by Date
        </button>
        <button
          onClick={() => {
            setSortBy("amount");
            setSortAsc(!sortAsc);
          }}
          className="flex items-center gap-2 text-sm bg-gray-800 px-3 py-1.5 rounded-md hover:bg-gray-700 transition"
        >
          {sortBy === "amount" && sortAsc ? <FaSortAmountUp /> : <FaSortAmountDown />}
          Sort by Amount
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-gray-900 rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-800 text-sm">
          <thead className="bg-gray-800 text-gray-300 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Sender</th>
              <th className="px-4 py-3">Receiver</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
                  No transactions found.
                </td>
              </tr>
            ) : (
              filteredTransactions.map((txn) => (
                <motion.tr
                  key={txn.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="hover:bg-gray-800 transition"
                >
                  <td className="px-4 py-3">{txn.id}</td>
                  <td className="px-4 py-3">{txn.sender || "—"}</td>
                  <td className="px-4 py-3">{txn.receiver || "—"}</td>
                  <td className="px-4 py-3 capitalize">{txn.type}</td>
                  <td className="px-4 py-3 text-green-400">KES {txn.amount}</td>
                  <td
                    className={`px-4 py-3 font-semibold ${
                      txn.status === "success"
                        ? "text-green-500"
                        : txn.status === "pending"
                        ? "text-yellow-400"
                        : "text-red-500"
                    }`}
                  >
                    {txn.status}
                  </td>
                  <td className="px-4 py-3">
                    {new Date(txn.timestamp).toLocaleString()}
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTransactions;
