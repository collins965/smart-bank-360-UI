import { useEffect, useState } from "react";
import { FiAlertCircle, FiActivity, FiClock } from "react-icons/fi";
import { motion } from "framer-motion";
import axios from "axios";

const AdminLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get("/api/admin/logs/");
        const logsArray = Array.isArray(res.data) ? res.data : res.data.logs || [];
        setLogs(logsArray);
      } catch (err) {
        console.error(err);
        setError("Failed to load logs.");
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 bg-[#0f172a] text-gray-200 rounded-xl mt-6 shadow-lg border border-gray-700">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
        <FiActivity className="text-indigo-400" /> Admin Logs
      </h1>

      {loading ? (
        <p className="text-indigo-400 animate-pulse">Loading logs...</p>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : logs.length === 0 ? (
        <p className="text-gray-400">No logs available.</p>
      ) : (
        <div className="space-y-4 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 pr-2">
          {logs.map((log, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="bg-[#1e293b] hover:bg-[#273549] transition-all duration-200 border-l-4 border-indigo-500 p-4 rounded-lg shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FiAlertCircle className="text-indigo-300" />
                  <p className="font-semibold text-white">{log.action}</p>
                </div>
                <span className="text-sm text-gray-400 flex items-center gap-1">
                  <FiClock />
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
              <p className="text-sm mt-1 text-gray-300">
                Performed by:{" "}
                <span className="font-medium text-indigo-300">{log.admin}</span>{" "}
                | IP: <span className="text-gray-400">{log.ip_address}</span>
              </p>
              {log.details && (
                <p className="text-sm mt-3 text-gray-400 bg-[#334155] p-2 rounded-md leading-snug">
                  {log.details}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminLogs;
