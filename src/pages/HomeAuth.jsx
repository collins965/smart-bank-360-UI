import React, { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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

//  Animated WelcomeMessage Component
const WelcomeMessage = ({ user, onDone }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShow(false);
      onDone();
    }, 4000);
    return () => clearTimeout(timeout);
  }, [onDone]);

  return (
    <div className="relative h-[80px]">
      {show && (
        <div
          className={`text-3xl font-bold text-green-600 absolute transition-opacity duration-1000 ease-in-out ${
            show ? 'opacity-100' : 'opacity-0'
          } animate-fade-in`}
        >
          Welcome back, {user.displayName || user.email?.split('@')[0]}
        </div>
      )}
    </div>
  );
};

//  Simulate live stock data
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
        const newData = [...prev.slice(1), {
          time: `${Number(prev[prev.length - 1].time) + 1}`,
          price: 100 + Math.sin((Number(prev[prev.length - 1].time) + 1) / 2) * 10 + Math.random() * 5,
        }];
        return newData;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-w-[300px] w-full sm:w-[350px] bg-white rounded-xl shadow border p-4">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
      <ResponsiveContainer width="100%" height={150}>
        <LineChart data={data}>
          <XAxis dataKey="time" hide />
          <YAxis domain={['auto', 'auto']} hide />
          <Tooltip />
          <Line type="monotone" dataKey="price" stroke="#10B981" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const HomeAuth = () => {
  const { user, loading: authLoading } = useAuth();
  const [offers, setOffers] = useState([]);
  const [showUsername, setShowUsername] = useState(false);

  const transactions = [
    { id: 1, type: 'income', amount: 50000, description: 'Salary for May', category: 'Salary', from: 'Vanguard', to: 'Your Account', timestamp: '2025-05-01T10:00:00Z' },
    { id: 2, type: 'expense', amount: 7500, description: 'Rent Payment', category: 'Housing', from: 'Your Account', to: 'Landlord', timestamp: '2025-05-03T08:30:00Z' },
    { id: 3, type: 'expense', amount: 3200, description: 'Groceries', category: 'Groceries', from: 'Your Account', to: 'Naivas', timestamp: '2025-05-05T13:45:00Z' },
    { id: 4, type: 'income', amount: 12000, description: 'Freelance Project', category: 'Side Hustle', from: 'Client XYZ', to: 'Your Account', timestamp: '2025-05-07T11:20:00Z' },
  ];

  const income = transactions.filter(tx => tx.type === 'income').reduce((sum, tx) => sum + tx.amount, 0);
  const expenses = transactions.filter(tx => tx.type === 'expense').reduce((sum, tx) => sum + tx.amount, 0);
  const balance = income - expenses;

  useEffect(() => {
    setOffers([
      { id: 1, title: '10% Fuel Cashback', description: 'Use SmartBank card at Shell for instant cashback.' },
      { id: 2, title: 'Jumia Fridays', description: 'Unlock discounts on Jumia using your wallet.' },
      { id: 3, title: 'Flight Rewards', description: 'Earn points when booking flights with SmartBank.' },
    ]);
  }, []);

  if (authLoading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      </div>
    );

  if (!user) return <Navigate to="/login" />;

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-10 animate-fade-in">
      {/* Welcome Message */}
      <WelcomeMessage user={user} onDone={() => setShowUsername(true)} />

      {/* Username after welcome */}
      {showUsername && (
        <div className="text-2xl font-semibold text-gray-800 animate-slide-in-down">
          Hello, <span className="text-green-700">{user.displayName || user.email?.split('@')[0]}</span>
        </div>
      )}

      {/* Account Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in-up">
        {/* Total Balance */}
        <div className="bg-white p-5 rounded-xl shadow border border-blue-100 flex flex-col space-y-2 items-start">
          <div className="flex items-center space-x-3">
            <BanknotesIcon className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-gray-500">Total Balance</p>
              <p className="text-xl font-semibold text-green-600">KES {balance.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
          <Link to="/mpesa">
              <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition">
                Deposit
              </button>
           </Link>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition">Transact</button>
          </div>
        </div>

        {/* Income */}
        <div className="bg-white p-5 rounded-xl shadow border border-blue-100 flex items-center space-x-4 animate-zoom-in">
          <CurrencyDollarIcon className="w-8 h-8 text-blue-500" />
          <div>
            <p className="text-gray-500">Monthly Income</p>
            <p className="text-xl font-semibold text-blue-600">KES {income.toLocaleString()}</p>
          </div>
        </div>

        {/* Expenses */}
        <div className="bg-white p-5 rounded-xl shadow border border-blue-100 flex items-center space-x-4 animate-zoom-in">
          <CurrencyDollarIcon className="w-8 h-8 text-red-500 rotate-180" />
          <div>
            <p className="text-gray-500">Monthly Expenses</p>
            <p className="text-xl font-semibold text-red-500">KES {expenses.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Offers */}
      <div className="animate-fade-in-up">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <GiftIcon className="w-6 h-6 text-yellow-500" />
          Exclusive Offers
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {offers.map((offer) => (
            <div key={offer.id} className="bg-white shadow-md rounded-xl p-4 border border-gray-200 transition hover:shadow-lg animate-fade-in">
              <h3 className="font-semibold text-lg text-blue-600">{offer.title}</h3>
              <p className="text-sm text-gray-600">{offer.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="animate-fade-in-up">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Recent Transactions</h2>
          <Link to="/transactions" className="text-blue-600 flex items-center hover:underline">
            View All
            <ArrowRightCircleIcon className="w-5 h-5 ml-1" />
          </Link>
        </div>

        {transactions.length === 0 ? (
          <p className="text-gray-600">No recent transactions found.</p>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {transactions.slice(0, 2).map((tx) => (
                <li key={tx.id} className="px-4 py-4 flex justify-between text-sm animate-fade-in">
                  <div>
                    <p className="font-medium text-gray-800">{tx.description}</p>
                    <p className="text-gray-500">{new Date(tx.timestamp).toLocaleDateString()}</p>
                    <p className="text-gray-400 text-xs">From: {tx.from} | To: {tx.to}</p>
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
      </div>

      {/*  Live Stock Graph Carousel */}
      <div className="animate-fade-in-up">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Live Stock Graphs</h2>
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
    </div>
  );
};

export default HomeAuth;
