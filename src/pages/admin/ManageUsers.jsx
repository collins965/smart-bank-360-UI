import { useState, useEffect } from "react";
import {
  FiSearch,
  FiTrash2,
  FiUser,
  FiSlash,
  FiCheckCircle,
  FiX,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";

// Default users
const dummyUsers = [
  { id: 1, name: "Alice Muthoni", email: "alice@gmail.com", phone: "0712345678", status: "Active" },
  { id: 2, name: "Brian Odhiambo", email: "brian@gmail.com", phone: "0723456789", status: "Frozen" },
  { id: 3, name: "Carol Njeri", email: "carol@gmail.com", phone: "0734567890", status: "Active" },
  { id: 4, name: "Chriss", email: "chriss@gmail.com", phone: "0744444444", status: "Active" },
  { id: 5, name: "Romeo", email: "romeo@gmail.com", phone: "0742712012", status: "Frozen" },
  { id: 6, name: "Collins", email: "kyalo7867@gmail.com", phone: "0755901372", status: "Active" },
];

const LOCAL_STORAGE_KEY = "sb360-users";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmModal, setConfirmModal] = useState(null);

  // Load users from localStorage or use default
  useEffect(() => {
    const savedUsers = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dummyUsers));
      setUsers(dummyUsers);
    }
  }, []);

  // Update localStorage on users change
  const updateUsers = (newUsers) => {
    setUsers(newUsers);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newUsers));
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleActionConfirm = () => {
    if (!confirmModal) return;
    const { type, user } = confirmModal;

    if (type === "delete") {
      const updated = users.filter((u) => u.id !== user.id);
      updateUsers(updated);
      toast.success(`Deleted ${user.name}`);
    } else if (type === "freeze") {
      const updatedStatus = user.status === "Active" ? "Frozen" : "Active";
      const updated = users.map((u) =>
        u.id === user.id ? { ...u, status: updatedStatus } : u
      );
      updateUsers(updated);
      toast.success(`${user.name}'s account is now ${updatedStatus}`);
    }

    setConfirmModal(null);
  };

  return (
    <motion.div
      className="bg-gray-950 min-h-screen text-gray-100 px-4 py-10"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h2 className="text-3xl font-bold flex items-center gap-2 text-white">
            <FiUser className="text-purple-500" /> Manage Users
          </h2>
          <div className="relative w-full sm:w-1/3">
            <FiSearch className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto shadow-xl rounded-xl border border-gray-800">
          <table className="w-full text-sm bg-gray-900 rounded-lg overflow-hidden">
            <thead className="bg-gray-800 text-purple-300 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Phone</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-t border-gray-800 hover:bg-gray-800/70 transition duration-200"
                  >
                    <td className="px-4 py-3 font-medium">{user.name}</td>
                    <td className="px-4 py-3 text-gray-300">{user.email}</td>
                    <td className="px-4 py-3 text-gray-300">{user.phone}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.status === "Active"
                            ? "bg-green-600/20 text-green-400"
                            : "bg-red-600/20 text-red-400"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right flex justify-end gap-3">
                      <button
                        title={user.status === "Active" ? "Freeze Account" : "Unfreeze Account"}
                        onClick={() => setConfirmModal({ type: "freeze", user })}
                        className={`${
                          user.status === "Active"
                            ? "text-yellow-400 hover:text-yellow-600"
                            : "text-green-400 hover:text-green-600"
                        } transition`}
                      >
                        {user.status === "Active" ? <FiSlash /> : <FiCheckCircle />}
                      </button>

                      <button
                        title="Delete User"
                        onClick={() => setConfirmModal({ type: "delete", user })}
                        className="text-red-500 hover:text-red-700 transition"
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-gray-500 italic">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gray-800 rounded-xl p-6 max-w-sm w-full shadow-2xl text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h3 className="text-lg font-semibold text-white mb-2">
                Are you sure?
              </h3>
              <p className="text-sm text-gray-300 mb-6">
                {confirmModal.type === "delete"
                  ? `Do you really want to delete ${confirmModal.user.name}? This action cannot be undone.`
                  : `Do you want to ${
                      confirmModal.user.status === "Active" ? "freeze" : "unfreeze"
                    } ${confirmModal.user.name}'s account?`}
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleActionConfirm}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-4 py-2 rounded-lg transition"
                >
                  Yes, Confirm
                </button>
                <button
                  onClick={() => setConfirmModal(null)}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-medium px-4 py-2 rounded-lg transition flex items-center gap-1"
                >
                  <FiX /> Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ManageUsers;
