import React, { useEffect, useState } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axiosInstance";
import {
  ArrowRightCircleIcon,
  CurrencyDollarIcon,
  GiftIcon,
  BanknotesIcon,
  EyeIcon,
  EyeSlashIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/solid";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";

const WELCOME_MESSAGES = [
  "Welcome back, {name}! We're thrilled to see you again.",
  "Hello, {name}! Hope you're having a fantastic day!",
  "Hey {name}, your SmartBank360 family missed you!",
  "Good to have you here, {name}! Let's make today great.",
  "Hi {name}! Ready to take your finances to the next level?",
];

const WelcomeMessage = ({ username, onDone }) => {
  const [show, setShow] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const randomMsg =
      WELCOME_MESSAGES[Math.floor(Math.random() * WELCOME_MESSAGES.length)];
    setMessage(randomMsg.replace("{name}", username || "there"));
  }, [username]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onDone, 500);
    }, 3500);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="w-full flex items-center justify-center bg-emerald-50 rounded-xl shadow-lg p-6 mb-8">
      <AnimatePresence>
        {show && (
          <motion.div
            className="text-3xl font-semibold text-emerald-700 text-center max-w-4xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            role="alert"
            aria-live="polite"
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const generateMockStockData = () =>
  Array.from({ length: 40 }, (_, i) => ({
    time: `${i}`,
    price: 100 + Math.sin(i / 2) * 10 + Math.random() * 5,
  }));

const StockGraph = ({ title }) => {
  const [data, setData] = useState(generateMockStockData());

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => {
        const next = Number(prev[prev.length - 1].time) + 1;
        return [
          ...prev.slice(1),
          {
            time: `${next}`,
            price: 100 + Math.sin(next / 2) * 10 + Math.random() * 5,
          },
        ];
      });
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-w-[260px] sm:min-w-[320px] bg-white rounded-2xl shadow p-4 border">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">{title}</h3>
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={data}>
          <XAxis dataKey="time" hide />
          <YAxis domain={["auto", "auto"]} hide />
          <Tooltip />
          <Line type="monotone" dataKey="price" stroke="#10B981" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const currency = (n) =>
  `KES ${Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

const shimmer =
  "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.6s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent";

const chipBase =
  "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";

const HomeAuth = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [username, setUsername] = useState("");
  const [wallet, setWallet] = useState(null);
  const [hasPin, setHasPin] = useState(false);
  const [history, setHistory] = useState([]);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);

  const [historyLoading, setHistoryLoading] = useState(true);
  const [walletLoading, setWalletLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);
  const [monthlyTotalsLoading, setMonthlyTotalsLoading] = useState(true);

  const [showWelcome, setShowWelcome] = useState(false);
  const [showStockInfo, setShowStockInfo] = useState(true);

  const [hidden, setHidden] = useState(true);
  const [pinPrompt, setPinPrompt] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");

  useEffect(() => {
    let mounted = true;

    const getProfile = async () => {
      try {
        setProfileLoading(true);
        const { data } = await axiosInstance.get("accounts/profile/");
        if (mounted) setUsername(data.username || "");
      } catch {
        if (mounted) setUsername("");
      } finally {
        if (mounted) setProfileLoading(false);
      }
    };

    const getWallet = async () => {
      try {
        setWalletLoading(true);
        const { data } = await axiosInstance.get("accounts/wallet/");
        if (mounted) {
          setWallet(data || {});
          setHasPin(!!data?.has_pin);
        }
      } catch {
        if (mounted) {
          setWallet({});
          setHasPin(false);
        }
      } finally {
        if (mounted) setWalletLoading(false);
      }
    };

    const getHistory = async () => {
      try {
        setHistoryLoading(true);
        const { data } = await axiosInstance.get("accounts/wallet/history/");
        const items = Array.isArray(data?.results) ? data.results : Array.isArray(data) ? data : [];
        if (mounted) setHistory(items);
      } catch {
        if (mounted) setHistory([]);
      } finally {
        if (mounted) setHistoryLoading(false);
      }
    };

    const getMonthlyTotals = async () => {
      try {
        setMonthlyTotalsLoading(true);
        const { data } = await axiosInstance.get("accounts/wallet/monthly-totals/");
        if (mounted) {
          setMonthlyIncome(Number(data.monthly_income || 0));
          setMonthlyExpenses(Number(data.monthly_expenses || 0));
        }
      } catch {
        if (mounted) {
          setMonthlyIncome(0);
          setMonthlyExpenses(0);
        }
      } finally {
        if (mounted) setMonthlyTotalsLoading(false);
      }
    };

    Promise.all([getProfile(), getWallet(), getHistory(), getMonthlyTotals()]).then(() => {
      if (mounted) setShowWelcome(true);
    });

    return () => {
      mounted = false;
    };
  }, []);

  const balance = Number(wallet?.balance ?? 0);

  const toggleHidden = () => {
    if (hidden) {
      setPinPrompt(true);
      setPinInput("");
      setPinError("");
    } else {
      setHidden(true);
    }
  };

  const submitPin = () => {
    if (!pinInput || !/^\d{4}$/.test(pinInput)) {
      setPinError("Enter your 4-digit PIN.");
      return;
    }
    setHidden(false);
    setPinPrompt(false);
    setPinInput("");
    setPinError("");
  };

  const doTopUp = () => navigate("/mpesa");
  const doWithdraw = () => navigate("/withdraw-mpesa");
  const doTransfer = () => navigate("/send-money");

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent"></div>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" />;

  const offers = [
    { id: 1, title: "10% Fuel Cashback", description: "Use SmartBank card at Shell for instant cashback." },
    { id: 2, title: "Jumia Fridays", description: "Unlock discounts on Jumia using your wallet." },
    { id: 3, title: "Flight Rewards", description: "Earn points when booking flights with SmartBank." },
  ];

  const STOCKS = ["Apple (AAPL)", "Google (GOOGL)", "Tesla (TSLA)", "Amazon (AMZN)", "Meta (META)"];
  const seamless = [...STOCKS, ...STOCKS];

  return (
    <div className="p-6 space-y-10">
      <AnimatePresence>
        {pinPrompt && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full border"
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
            >
              <h3 className="text-lg font-semibold mb-4">Enter PIN to View Amounts</h3>
              {!hasPin && (
                <p className="text-xs text-amber-600 mb-2">
                  You haven’t set a wallet PIN yet. Go to Wallet &gt; Set PIN to secure your account.
                </p>
              )}
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                maxLength={4}
                className={`border rounded-xl w-full px-4 py-2 mb-2 outline-none focus:ring-2 focus:ring-emerald-500 ${pinError ? "border-red-400" : "border-gray-300"
                  }`}
                placeholder="••••"
              />
              {pinError && <p className="text-xs text-red-500 mb-3">{pinError}</p>}
              <div className="flex gap-2">
                <button
                  onClick={submitPin}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl transition"
                >
                  Submit
                </button>
                <button
                  onClick={() => setPinPrompt(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-xl transition"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showWelcome && (
          <WelcomeMessage username={username} onDone={() => setShowWelcome(false)} />
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div
          className={`bg-white p-5 rounded-2xl shadow border flex flex-col gap-4 relative ${walletLoading ? shimmer : ""
            }`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <button
            onClick={toggleHidden}
            aria-label="Toggle balance visibility"
            className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full"
            title={hidden ? "Show amounts" : "Hide amounts"}
          >
            {hidden ? (
              <EyeIcon className="w-5 h-5 text-gray-600" />
            ) : (
              <EyeSlashIcon className="w-5 h-5 text-gray-600" />
            )}
          </button>
          <div className="flex items-center gap-3">
            <BanknotesIcon className="w-9 h-9 text-emerald-600" />
            <div>
              <p className="text-gray-500">Total Balance</p>
              <p className="text-2xl font-bold text-emerald-700 tracking-tight">
                {walletLoading ? " " : hidden ? "••••" : currency(balance)}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={doTopUp} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl transition">
              Deposit
            </button>
            <button onClick={doTransfer} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition">
              Transact
            </button>
            <button onClick={doWithdraw} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl transition">
              Withdraw
            </button>
          </div>
          <div className="text-xs text-gray-400">
            {wallet?.created_at && (
              <span>Wallet since {new Date(wallet.created_at).toLocaleDateString()}</span>
            )}
          </div>
        </motion.div>

        <motion.div
          className={`bg-white p-5 rounded-2xl shadow border flex items-center gap-4 ${monthlyTotalsLoading ? shimmer : ""
            }`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
            <CurrencyDollarIcon className="w-7 h-7 text-blue-600" />
          </div>
          <div>
            <p className="text-gray-500">Monthly Income</p>
            <p className="text-xl font-semibold text-blue-700">
              {monthlyTotalsLoading ? " " : hidden ? "••••" : currency(monthlyIncome)}
            </p>
          </div>
        </motion.div>

        <motion.div
          className={`bg-white p-5 rounded-2xl shadow border flex items-center gap-4 ${monthlyTotalsLoading ? shimmer : ""
            }`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center">
            <CurrencyDollarIcon className="w-7 h-7 text-rose-600 rotate-180" />
          </div>
          <div>
            <p className="text-gray-500">Monthly Expenses</p>
            <p className="text-xl font-semibold text-rose-700">
              {monthlyTotalsLoading ? " " : hidden ? "••••" : currency(monthlyExpenses)}
            </p>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
          <GiftIcon className="w-6 h-6 text-yellow-500" /> Exclusive Offers
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {offers.map((o) => (
            <motion.div
              key={o.id}
              className="bg-white shadow rounded-2xl p-4 border hover:shadow-lg relative overflow-hidden"
              whileHover={{ y: -2, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 250, damping: 18 }}
            >
              <div className="absolute -right-8 -top-8 w-24 h-24 bg-yellow-100 rounded-full" />
              <h3 className="font-semibold text-lg text-blue-700 relative">{o.title}</h3>
              <p className="text-sm text-gray-600 relative">{o.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Recent Transactions</h2>
          <Link
            to="/transactions"
            className="flex items-center text-blue-600 hover:underline"
          >
            View All <ArrowRightCircleIcon className="w-5 h-5 ml-1" />
          </Link>
        </div>

        {historyLoading ? (
          <div className={`bg-white rounded-2xl p-6 border shadow ${shimmer}`}>
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-3" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        ) : history.length === 0 ? (
          <p className="text-gray-600">No recent transactions found.</p>
        ) : (
          <div className="bg-white shadow rounded-2xl overflow-hidden border">
            <ul className="divide-y divide-gray-100">
              {history.slice(0, 5).map((tx) => {
                const isSent = tx.direction === "sent";
                const dirChip = isSent ? (
                  <span className={`${chipBase} bg-rose-50 text-rose-700 border border-rose-200`}>
                    Sent
                  </span>
                ) : tx.direction === "received" ? (
                  <span className={`${chipBase} bg-emerald-50 text-emerald-700 border border-emerald-200`}>
                    Received
                  </span>
                ) : (
                  <span className={`${chipBase} bg-gray-50 text-gray-700 border border-gray-200`}>
                    {String(tx.transaction_type || "").replaceAll("_", " ")}
                  </span>
                );

                return (
                  <li
                    key={tx.id}
                    className="px-4 py-4 flex items-center justify-between text-sm hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center gap-3">
                      {dirChip}
                      <div>
                        <p className="font-medium text-gray-900">{tx.description || "—"}</p>
                        <p className="text-gray-500">
                          {new Date(tx.timestamp).toLocaleString()}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {tx.sender ? `From: ${tx.sender}` : ""}{" "}
                          {tx.receiver ? `| To: ${tx.receiver}` : ""}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${isSent ? "text-rose-600" : "text-emerald-600"}`}>
                        {isSent ? "-" : "+"} {currency(Math.abs(tx.amount))}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {String(tx.status || "").toUpperCase()}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-gray-800">Live Stock Graphs</h2>
          <button
            onClick={() => setShowStockInfo((p) => !p)}
            className="flex items-center text-blue-600 hover:underline"
          >
            {showStockInfo ? (
              <ChevronUpIcon className="w-5 h-5 mr-1" />
            ) : (
              <ChevronDownIcon className="w-5 h-5 mr-1" />
            )}
            {showStockInfo ? "Hide Info" : "Show Info"}
          </button>
        </div>

        <AnimatePresence>
          {showStockInfo && (
            <motion.p
              className="text-sm text-gray-600 mb-4 bg-blue-50 p-3 rounded-2xl border border-blue-100"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
            >
              These stock graphs display live-like trends for top global companies.
            </motion.p>
          )}
        </AnimatePresence>

        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white to-transparent z-10" />

          <div className="overflow-hidden">
            <div className="carousel-track flex gap-4">
              {seamless.map((title, i) => (
                <StockGraph key={`${title}-${i}`} title={title} />
              ))}
            </div>
          </div>
        </div>

        <style>{`
          @keyframes scroll-left {
            0%   { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .carousel-track {
            width: 200%;
            animation: scroll-left 40s linear infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .carousel-track { animation: none; }
          }
          @keyframes shimmer {
            100% { transform: translateX(100%); }
          }
        `}</style>
      </motion.div>
    </div>
  );
};

export default HomeAuth;