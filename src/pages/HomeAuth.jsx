import React, { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
  ArrowRightCircleIcon,
  CurrencyDollarIcon,
  GiftIcon,
  BanknotesIcon,
} from '@heroicons/react/24/solid';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

// Welcome Message Component
const WelcomeMessage = ({ username, onDone }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      onDone();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="relative h-20 flex items-center justify-center">
      <AnimatePresence>
        {show && (
          <motion.div
            className="text-3xl font-bold text-green-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            Welcome back, {username}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Generate mock stock data
const generateMockStockData = () =>
  Array.from({ length: 20 }, (_, i) => ({
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
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-w-[250px] sm:min-w-[300px] bg-white rounded-xl shadow p-4">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
      <ResponsiveContainer width="100%" height={150}>
        <LineChart data={data}>
          <XAxis dataKey="time" hide />
          <YAxis domain={['auto', 'auto']} hide />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#10B981"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const HomeAuth = () => {
  const { user, loading: authLoading } = useAuth();
  const [wallet, setWallet] = useState(null);
  const [history, setHistory] = useState([]);
  const [username, setUsername] = useState('');
  const [showHello, setShowHello] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access');
    const headers = { Authorization: `Bearer ${token}` };

    const fetchData = async () => {
      try {
        const [profileRes, walletRes, historyRes] = await Promise.all([
          axios.get('http://127.0.0.1:8000/api/accounts/profile/', { headers }),
          axios.get('http://127.0.0.1:8000/api/accounts/wallet/', { headers }),
          axios.get('http://127.0.0.1:8000/api/accounts/wallet/history/', { headers }),
        ]);

        setUsername(profileRes.data.username || '');
        setWallet(walletRes.data || {});
        const historyData = historyRes.data;
        setHistory(Array.isArray(historyData) ? historyData : []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setWallet({});
        setHistory([]);
      }
    };

    fetchData();
  }, []);

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" />;

  const income = Array.isArray(history)
    ? history.filter(tx => tx.type === 'income').reduce((sum, tx) => sum + tx.amount, 0)
    : 0;

  const expenses = Array.isArray(history)
    ? history.filter(tx => tx.type === 'expense').reduce((sum, tx) => sum + tx.amount, 0)
    : 0;

  const balance = wallet?.balance ?? (income - expenses);

  const offers = [
    {
      id: 1,
      title: '10% Fuel Cashback',
      description: 'Use SmartBank card at Shell for instant cashback.',
    },
    {
      id: 2,
      title: 'Jumia Fridays',
      description: 'Unlock discounts on Jumia using your wallet.',
    },
    {
      id: 3,
      title: 'Flight Rewards',
      description: 'Earn points when booking flights with SmartBank.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 space-y-6">
      <WelcomeMessage username={username} onDone={() => setShowHello(true)} />
      <AnimatePresence>
        {showHello && (
          <motion.div
            className="text-2xl font-semibold text-gray-800 text-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            Hello, <span className="text-green-700">{username}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Account Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          className="bg-white p-5 rounded-xl shadow border flex flex-col gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-3">
            <BanknotesIcon className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-gray-500">Total Balance</p>
              <p className="text-xl font-semibold text-green-600">
                KES {balance.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link to="/mpesa">
              <button className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
                Deposit
              </button>
            </Link>
            <Link to="/send-money">
              <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                Transact
              </button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          className="bg-white p-5 rounded-xl shadow border flex items-center gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <CurrencyDollarIcon className="w-8 h-8 text-blue-500" />
          <div>
            <p className="text-gray-500">Monthly Income</p>
            <p className="text-xl font-semibold text-blue-600">
              KES {income.toLocaleString()}
            </p>
          </div>
        </motion.div>

        <motion.div
          className="bg-white p-5 rounded-xl shadow border flex items-center gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <CurrencyDollarIcon className="w-8 h-8 text-red-500 rotate-180" />
          <div>
            <p className="text-gray-500">Monthly Expenses</p>
            <p className="text-xl font-semibold text-red-500">
              KES {expenses.toLocaleString()}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Offers */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
          <GiftIcon className="w-6 h-6 text-yellow-500" /> Exclusive Offers
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {offers.map((o) => (
            <motion.div
              key={o.id}
              className="bg-white shadow rounded-xl p-4 border hover:shadow-lg"
              whileHover={{ scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <h3 className="font-semibold text-lg text-blue-600">{o.title}</h3>
              <p className="text-sm text-gray-600">{o.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Transactions */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Recent Transactions</h2>
          <Link to="/transactions" className="flex items-center text-blue-600 hover:underline">
            View All <ArrowRightCircleIcon className="w-5 h-5 ml-1" />
          </Link>
        </div>
        {history.length === 0 ? (
          <p className="text-gray-600">No recent transactions found.</p>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {history.slice(0, 3).map((tx) => (
                <li key={tx.id} className="px-4 py-4 flex justify-between text-sm">
                  <div>
                    <p className="font-medium text-gray-800">{tx.description}</p>
                    <p className="text-gray-500">{new Date(tx.timestamp).toLocaleDateString()}</p>
                    <p className="text-gray-400 text-xs">
                      From: {tx.from} | To: {tx.to}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${tx.type === 'expense' ? 'text-red-500' : 'text-green-500'}`}>
                      {tx.type === 'expense' ? '-' : '+'} KES {Math.abs(tx.amount).toLocaleString()}
                    </p>
                    <p className="text-gray-500 text-xs">{tx.category}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </motion.div>

      {/* Stocks */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Live Stock Graphs</h2>
              <div className="animate-fade-in-up">
        <div className="auto-scroll-graphs">
  <div className="auto-scroll-track space-x-4 px-2">
    {[
      "Apple (AAPL)",
      "Google (GOOGL)",
      "Tesla (TSLA)",
      "Amazon (AMZN)",
      "Meta (META)",
      "Apple (AAPL)",
      "Google (GOOGL)",
      "Tesla (TSLA)",
      "Amazon (AMZN)",
      "Meta (META)",
    ].map((title, index) => (
      <StockGraph key={index} title={title} />
    ))}
  </div>
</div>

      </div>
      </motion.div>
    </div>
  );
};

export default HomeAuth;
