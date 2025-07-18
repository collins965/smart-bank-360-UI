import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white w-full mt-8 sm:mt-12">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 sm:py-8 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {/* Left: Logo and Info */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <Link to="/" className="flex items-center justify-center md:justify-start mb-4">
            {/* Increased logo size and made it responsive */}
            <div className="w-20 h-20 sm:w-40 sm:h-40">
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 400 300" // Keeping original viewBox, scaling will happen via parent div
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="150" cy="100" r="80" stroke="#2563EB" strokeWidth="8" fill="none" />
                <circle cx="150" cy="100" r="70" stroke="#2563EB" strokeDasharray="5,5" strokeWidth="4" fill="none" />
                <rect x="115" y="85" width="70" height="40" rx="8" ry="8" fill="none" stroke="#2563EB" strokeWidth="4" />
                <line x1="115" y1="105" x2="185" y2="105" stroke="#2563EB" strokeDasharray="4,4" strokeWidth="3" />
                <circle cx="180" cy="105" r="5" fill="#2563EB" />
                <text x="130" y="80" fontSize="20" fill="#2563EB" fontFamily="Arial" fontWeight="bold">360°</text>
                <path d="M120,60 A30,30 0 0,1 180,60" stroke="#2563EB" strokeWidth="3" fill="none" markerEnd="url(#arrowhead)" />
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#2563EB" />
                  </marker>
                </defs>
                <text x="240" y="130" fontSize="22" fill="#2563EB" fontFamily="Arial" fontWeight="bold">SMART</text>
                <text x="230" y="160" fontSize="22" fill="#2563EB" fontFamily="Arial" fontWeight="bold">BANK 360</text>
              </svg>
            </div>
          </Link>
          <p className="text-xs sm:text-sm text-gray-300">
            SmartBank360 — where banking meets innovation.
          </p>
        </div>

        {/* Center: Quick Links */}
        <div className="text-center md:text-left">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Quick Links</h3>
          <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-300">
            <li><Link to="/about" className="hover:text-blue-400">About</Link></li>
            <li><Link to="/services" className="hover:text-blue-400">Services</Link></li>
            <li><Link to="/contact" className="hover:text-blue-400">Contact</Link></li>
            <li><Link to="/login" className="hover:text-blue-400">Login</Link></li>
            <li><Link to="/register" className="hover:text-blue-400">Register</Link></li>
          </ul>
        </div>

        {/* Right: Contact Info */}
        <div className="text-center md:text-left">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Contact Us</h3>
          <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-300">
            <p>
              Phone:{" "}
              <a href="tel:0755901372" className="text-blue-400 hover:underline">
                0755 901 372
              </a>
            </p>
            <p>
              Email:{" "}
              <a href="mailto:support@smartbank360.co.ke" className="text-blue-400 hover:underline">
                support@smartbank360.co.ke
              </a>
            </p>
          </div>
        </div>
      </div>

      <div className="text-center py-3 sm:py-4 border-t border-gray-800 text-xs sm:text-sm text-gray-400">
        &copy; {new Date().getFullYear()} SmartBank360. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
