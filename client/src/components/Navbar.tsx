import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-transparent py-4 px-6 fixed top-0 left-0 right-0 w-full z-50 shadow-md">
      <div className="flex justify-between items-center max-w-screen-xl mx-auto">
        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-semibold text-gray-900 hover:text-gray-600 transition duration-300"
        >
          MyLogo
        </Link>

        {/* Hamburger Menu (for mobile) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden text-gray-900 hover:text-gray-600 focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Links for Desktop */}
        <div
          className={`lg:flex items-center space-x-6 transition-all duration-300 ease-in-out ${
            isOpen ? "block" : "hidden"
          }`}
        >
          <Link
            to="/profile"
            className="text-gray-900 hover:text-gray-600 transition duration-300"
          >
            My Profile
          </Link>
          <Link
            to="/login"
            className="text-gray-900 hover:text-gray-600 transition duration-300"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="text-gray-900 hover:text-gray-600 transition duration-300"
          >
            Register
          </Link>
          <button
            onClick={() => console.log("Logging out")}
            className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors duration-300"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
