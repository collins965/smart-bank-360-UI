import { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiSend, FiX, FiLoader } from "react-icons/fi";

const SendMoney = () => {
  const [formData, setFormData] = useState({
    recipient: "",
    amount: "",
    reference: "",
    pin: "",
  });

  const [recipientInfo, setRecipientInfo] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "pin" && value.length > 4) return; // max 4 digits for PIN
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Verify recipient before showing confirmation modal
  const handleVerifyRecipient = async (e) => {
    e.preventDefault();
    const recipient = formData.recipient.trim();
    const amount = formData.amount.trim();

    if (!recipient || !amount) {
      toast.error("Recipient and amount are required.");
      return;
    }

    if (isNaN(amount) || Number(amount) <= 0) {
      toast.error("Enter a valid positive amount.");
      return;
    }

    setVerifying(true);
    try {
      const res = await axiosInstance.get("/accounts/recipient-profile/", {
        params: { username: recipient },
      });

      if (!res.data.username) {
        toast.error("Recipient not found.");
        return;
      }

      setRecipientInfo(res.data);
      setShowConfirmModal(true);
    } catch (err) {
      toast.error(err.response?.data?.error || "Recipient verification failed.");
    } finally {
      setVerifying(false);
    }
  };

  // Confirm and send money
  const handleConfirmSend = async () => {
    const { recipient, amount, reference, pin } = formData;
    const trimmedRecipient = recipient.trim();
    const trimmedReference = reference.trim();

    if (!pin || !/^\d{4}$/.test(pin)) {
      toast.error("Enter a valid 4-digit PIN.");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      toast.error("Enter a valid amount.");
      return;
    }

    setLoading(true);
    try {
      const res = await axiosInstance.post("/accounts/wallet/transfer/", {
        receiver_username: trimmedRecipient,
        amount: amount.toString(), // send as string for Decimal conversion
        reference: trimmedReference,
        pin,
      });

      // If backend returns success and optional notification info
      const detail = res.data?.detail || "Transaction successful!";
      toast.success(detail);

      setFormData({ recipient: "", amount: "", reference: "", pin: "" });
      setRecipientInfo(null);
      setShowConfirmModal(false);
    } catch (err) {
      const backendMessage = err?.response?.data?.detail || err?.response?.data?.error;

      // Handle specific notification types from backend
      if (backendMessage?.toLowerCase().includes("low balance")) {
        toast.warn(backendMessage);
      } else if (backendMessage?.toLowerCase().includes("transfer received")) {
        toast.success(backendMessage);
      } else {
        toast.error(backendMessage || "Transaction failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-10 bg-white shadow-md rounded-lg relative">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Send Money</h2>

      <form onSubmit={handleVerifyRecipient} className="space-y-4" noValidate>
        <div>
          <label className="block mb-1 font-medium text-gray-700">Recipient Username</label>
          <input
            type="text"
            name="recipient"
            value={formData.recipient}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoComplete="off"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Amount (KSh)</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            min="1"
            step="0.01"
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Reference (optional)</label>
          <input
            type="text"
            name="reference"
            value={formData.reference}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={verifying}
          className={`w-full py-2 px-4 text-white rounded font-semibold transition ${
            verifying ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          } flex items-center justify-center`}
        >
          {verifying ? (
            <>
              <FiLoader className="animate-spin mr-2" /> Verifying...
            </>
          ) : (
            <>
              <FiSend className="mr-2" /> Verify & Continue
            </>
          )}
        </button>
      </form>

      {showConfirmModal && recipientInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-96 relative animate-scaleUp">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              onClick={() => setShowConfirmModal(false)}
            >
              <FiX size={20} />
            </button>

            <h3 className="text-xl font-bold mb-4 text-center text-green-700">Confirm Transaction</h3>

            <div className="mb-4 space-y-2 text-gray-800">
              <p>
                <span className="font-semibold text-gray-900">Recipient:</span>{" "}
                {recipientInfo.username}
              </p>
              <p>
                <span className="font-semibold text-gray-900">Phone:</span>{" "}
                {recipientInfo.phone}
              </p>
              <p className="text-lg font-bold">
                <span className="font-semibold text-gray-900">Amount:</span>{" "}
                KSh {Number(formData.amount).toLocaleString()}
              </p>
              {formData.reference && (
                <p>
                  <span className="font-semibold text-gray-900">Reference:</span>{" "}
                  {formData.reference}
                </p>
              )}
            </div>

            <input
              type="password"
              name="pin"
              value={formData.pin}
              onChange={handleChange}
              placeholder="Enter your 4-digit PIN"
              maxLength={4}
              className="border border-gray-300 px-3 py-2 rounded-md w-full mb-4 focus:ring-2 focus:ring-green-400"
            />

            <button
              onClick={handleConfirmSend}
              disabled={loading}
              className={`w-full py-2 px-4 text-white rounded font-semibold transition ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {loading ? "Processing..." : "Confirm & Send"}
            </button>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default SendMoney;
