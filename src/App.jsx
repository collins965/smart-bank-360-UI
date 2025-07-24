// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import NavbarAuth from "./components/NavbarAuth";
import FooterAuth from "./components/FooterAuth";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Services from "./pages/Services";

import HomeAuth from "./pages/HomeAuth";
import Mpesa from "./pages/Mpesa";
import Wallet from "./pages/Wallet";
import Profile from "./pages/Profile";
import SendMoney from "./pages/SendMoney";


const App = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Dynamic Navbar */}
      {isAuthenticated ? <NavbarAuth /> : <Navbar />}

      <main className="flex-grow p-6">
        <Routes>
          {isAuthenticated ? (
            <>
              <Route path="/" element={<HomeAuth />} />
              <Route path="/mpesa" element={<Mpesa />} />
              <Route path="/wallet" element={<Wallet />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/send-money" element={<SendMoney />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/services" element={<Services />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}
        </Routes>
      </main>

      {/* Dynamic Footer */}
      {isAuthenticated ? <FooterAuth /> : <Footer />}
    </div>
  );
};

export default App;
