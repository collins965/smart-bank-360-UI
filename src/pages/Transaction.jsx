import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import { FiSearch, FiLoader } from "react-icons/fi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Transaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    start_date: "",
    end_date: "",
    amount_min: "",
    amount_max: "",
    type: "", // "credit" or "debit"
  });

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/api/transactions/", {
        params: { ...filters },
      });
      setTransactions(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleInputChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchTransactions();
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Transaction History</h2>

      {/* Filters */}
      <form
        onSubmit={handleFilterSubmit}
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg shadow"
      >
        <input
          type="date"
          name="start_date"
          value={filters.start_date}
          onChange={handleInputChange}
          className="input"
          placeholder="Start Date"
        />
        <input
          type="date"
          name="end_date"
          value={filters.end_date}
          onChange={handleInputChange}
          className="input"
          placeholder="End Date"
        />
        <input
          type="number"
          name="amount_min"
          value={filters.amount_min}
          onChange={handleInputChange}
          className="input"
          placeholder="Min Amount"
        />
        <input
          type="number"
          name="amount_max"
          value={filters.amount_max}
          onChange={handleInputChange}
          className="input"
          placeholder="Max Amount"
        />
        <select
          name="type"
          value={filters.type}
          onChange={handleInputChange}
          className="input"
        >
          <option value="">All Types</option>
          <option value="credit">Credit</option>
          <option value="debit">Debit</option>
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center justify-center"
        >
          <FiSearch className="mr-2" />
          Filter
        </button>
      </form>

      {/* Transactions Table */}
      <div className="overflow-x-auto mt-6">
        {loading ? (
          <div className="flex justify-center py-10 text-blue-600">
            <FiLoader className="animate-spin mr-2" size={24} />
            Loading...
          </div>
        ) : transactions.length > 0 ? (
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">From</th>
                <th className="px-4 py-2">To</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-t">
                  <td className="px-4 py-2">{new Date(tx.timestamp).toLocaleString()}</td>
                  <td className="px-4 py-2 capitalize">{tx.type}</td>
                  <td className="px-4 py-2">KSh {tx.amount.toLocaleString()}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded ${
                        tx.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : tx.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">{tx.sender_username || "—"}</td>
                  <td className="px-4 py-2">{tx.receiver_username || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500 py-6">No transactions found.</p>
        )}
      </div>
    </div>
  );
};

export default Transaction;
