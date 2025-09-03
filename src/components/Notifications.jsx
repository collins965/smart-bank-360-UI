import React, { useEffect, useState, useCallback } from "react";
import axiosInstance from "../api/axiosInstance";
import { Bell, CheckCircle, Trash2, Frown, XCircle } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";

// Confirm delete modal
const ConfirmDeleteModal = ({ show, onConfirm, onCancel }) => {
  if (!show) return null;
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-sm text-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
      >
        <XCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h2 className="text-xl font-semibold mb-2">Delete Notification?</h2>
        <p className="text-gray-600 mb-6">
          This action cannot be undone. Are you sure?
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl border font-medium text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl bg-red-500 text-white font-medium shadow hover:bg-red-600 transition"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Single notification component
const NotificationItem = ({ notif, onMarkRead, onDelete }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
    className={`p-4 rounded-2xl shadow-sm flex justify-between items-center transition-colors duration-300 ${
      notif.is_read ? "bg-white border" : "bg-emerald-50 border border-emerald-200"
    }`}
  >
    <div>
      <p className="font-semibold text-gray-800">
        {notif.message ?? "Notification message unavailable"}
      </p>
      <p className="text-sm text-gray-500">
        {notif.timestamp
          ? new Date(notif.timestamp).toLocaleString()
          : "Timestamp unavailable"}
      </p>
    </div>
    <div className="flex gap-3 flex-shrink-0 ml-4">
      {!notif.is_read && (
        <button
          onClick={() => onMarkRead(notif.id)}
          className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-full transition-all"
          title="Mark as read"
        >
          <CheckCircle className="w-5 h-5" />
        </button>
      )}
      <button
        onClick={() => onDelete(notif.id)}
        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full transition-all"
        title="Delete"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  </motion.div>
);

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Fetch notifications from API
  const fetchNotifications = useCallback(
    async (pageNum = 1, filterStatus = filter) => {
      try {
        setLoading(true);
        const params = { page: pageNum };
        if (filterStatus !== "all") params.status = filterStatus;

        const { data } = await axiosInstance.get("user/notifications/", { params });
        setNotifications(data.results ?? []);
        setTotalCount(data.count ?? 0);
        setHasNextPage(Boolean(data.next));
        setHasPrevPage(Boolean(data.previous));
        setPage(pageNum);
      } catch (err) {
        console.error("Error fetching notifications:", err);
        toast.error("Failed to load notifications.");
        setNotifications([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    },
    [filter]
  );

  // Mark notification as read
  const markAsRead = async (id) => {
    const original = [...notifications];
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    try {
      await axiosInstance.post(`user/notifications/${id}/mark-read/`);
      toast.success("Notification marked as read");
    } catch (err) {
      console.error("Error marking notification as read:", err);
      toast.error("Failed to mark as read. Reverting.");
      setNotifications(original);
    }
  };

  // Confirm deletion
  const confirmDelete = (id) => setDeleteId(id);

  // Delete notification
  const handleDeleteConfirmed = async () => {
    if (!deleteId) return;
    const id = deleteId;
    setDeleteId(null);

    const original = [...notifications];
    setNotifications(notifications.filter((n) => n.id !== id));
    setTotalCount((prev) => Math.max(0, prev - 1));

    try {
      await axiosInstance.delete(`user/notifications/${id}/delete/`);
      toast.success("Notification deleted");
    } catch (err) {
      console.error("Error deleting notification:", err);
      toast.error("Failed to delete. Reverting.");
      setNotifications(original);
      setTotalCount((prev) => prev + 1);
    }
  };

  // Initial load + auto-refresh every 30s
  useEffect(() => {
    fetchNotifications(1, filter);
    const interval = setInterval(() => fetchNotifications(page, filter), 30000);
    return () => clearInterval(interval);
  }, [filter, page, fetchNotifications]);

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold flex items-center gap-2 text-gray-800">
            <Bell className="w-7 h-7 text-emerald-600" />
            Notifications ({totalCount})
          </h1>
          <div className="flex gap-2 p-1 bg-gray-200 rounded-xl">
            {["all", "unread", "read"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                  filter === status
                    ? "bg-gradient-to-r from-emerald-500 to-green-400 text-white shadow"
                    : "text-gray-600 hover:bg-gray-300/50"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </header>

        {/* Notifications List */}
        <main className="space-y-4">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="p-4 bg-gray-200 animate-pulse rounded-2xl h-20 w-full" />
            ))
          ) : notifications.length === 0 ? (
            <div className="text-center p-12 bg-white shadow-sm rounded-2xl border">
              <Frown className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600 font-medium">
                You have no {filter !== "all" && filter} notifications.
              </p>
            </div>
          ) : (
            <AnimatePresence>
              {notifications.map((notif) => (
                <NotificationItem
                  key={notif.id}
                  notif={notif}
                  onMarkRead={markAsRead}
                  onDelete={confirmDelete}
                />
              ))}
            </AnimatePresence>
          )}
        </main>

        {/* Pagination */}
        {!loading && (hasNextPage || hasPrevPage) && (
          <footer className="flex justify-between items-center mt-8">
            <button
              disabled={!hasPrevPage}
              onClick={() => fetchNotifications(page - 1)}
              className="px-5 py-2 rounded-xl font-medium bg-white border shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              Previous
            </button>
            <span className="text-gray-600">Page {page}</span>
            <button
              disabled={!hasNextPage}
              onClick={() => fetchNotifications(page + 1)}
              className="px-5 py-2 rounded-xl font-medium bg-white border shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              Next
            </button>
          </footer>
        )}

        <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} />
      </div>

      {/* Confirm delete modal */}
      <AnimatePresence>
        {deleteId && (
          <ConfirmDeleteModal
            show={!!deleteId}
            onConfirm={handleDeleteConfirmed}
            onCancel={() => setDeleteId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
