import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// Public & Auth Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import NavbarAuth from "./components/NavbarAuth";
import FooterAuth from "./components/FooterAuth";
import Sidebar from "./components/Sidebar";

// Public Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Services from "./pages/Services";

// Authenticated Pages
import HomeAuth from "./pages/HomeAuth";
import Mpesa from "./pages/Mpesa";
import Wallet from "./pages/Wallet";
import Profile from "./pages/Profile";
import SendMoney from "./pages/SendMoney";
import LoanPage from "./pages/LoanCalculator";
import Settings from "./pages/Settings";
import Analysis from "./pages/Analysis";
import Loan from "./pages/Loan";
import BudgetPlanner from "./pages/BudgetPlanner";
import WithdrawMpesa from "./pages/WithdrawMpesa";
import Notifications from "./components/Notifications";

// Admin Pages
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import Transactions from "./pages/admin/AdminTransactions";
import AddAdmin from "./pages/admin/AddAdmin";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import SecuritySettings from "./pages/admin/AdminSecuritySettings";
import Logs from "./pages/admin/AdminLogs";

const App = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith("/sb360-admin");

  return (
    <div className={`flex flex-col min-h-screen ${isAdminPath ? "bg-gray-950" : "bg-gray-50"}`}>
      {/* Navbar */}
      {!isAdminPath && (
        <header className="w-full">
          {isAuthenticated ? <NavbarAuth /> : <Navbar />}
        </header>
      )}

      {/* Main */}
      <main className={`flex-grow w-full ${isAdminPath ? "p-0" : "px-4 sm:px-6 md:px-8 py-6"}`}>
        <Routes>
          {/* Admin Routes */}
          <Route path="/sb360-admin" element={<AdminLogin />} />
          <Route path="/sb360-admin/dashboard" element={<AdminDashboard />} />
          <Route path="/sb360-admin/users" element={<ManageUsers />} />
          <Route path="/sb360-admin/transactions" element={<Transactions />} />
          <Route path="/sb360-admin/add-admin" element={<AddAdmin />} />
          <Route path="/sb360-admin/analytics" element={<AdminAnalytics />} />
          <Route path="/sb360-admin/security-settings" element={<SecuritySettings />} />
          <Route path="/sb360-admin/logs" element={<Logs />} />

          {/* Authenticated Routes */}
          {isAuthenticated ? (
            <>
              <Route path="/" element={<HomeAuth />} />
              <Route path="/mpesa" element={<Mpesa />} />
              <Route path="/wallet" element={<Wallet />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/send-money" element={<SendMoney />} />
              <Route path="/sidebar" element={<Sidebar />} />
              <Route path="/loan-calculator" element={<LoanPage />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/analytics" element={<Analysis />} />
              <Route path="/loan" element={<Loan />} />
              <Route path="/budget-planner" element={<BudgetPlanner />} />
              <Route path="/withdraw-mpesa" element={<WithdrawMpesa />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          ) : (
            <>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/services" element={<Services />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          )}
        </Routes>
      </main>

      {/* Footer */}
      {!isAdminPath && (
        <footer className="w-full mt-auto">
          {isAuthenticated ? <FooterAuth /> : <Footer />}
        </footer>
      )}
    </div>
  );
};

export default App;
