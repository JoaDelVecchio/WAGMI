import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../context/AuthContextProvider";

const Navbar = () => {
  const { currentUser } = useAuthContext();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleLogout = () => {
    // Add the logout logic here
  };

  return (
    <nav className="bg-transparent py-4 px-6 fixed top-0 left-0 right-0 w-full z-50 shadow-md">
      <div className="flex justify-between items-center max-w-screen-xl mx-auto">
        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition duration-300 ease-in-out"
        >
          WAGMI
        </Link>

        <div className="flex items-center gap-4">
          {/* Hamburger Menu (for mobile) */}

          {/* Links for Desktop */}
          <div
            className={`lg:flex items-center space-x-6 transition-all duration-300 ease-in-out transform ${
              isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"
            } lg:opacity-100 lg:scale-100 lg:flex-row lg:items-center`}
          >
            {/* My Profile Link (only visible if logged in) */}
            {currentUser && (
              <Link
                to="/profile"
                className="text-gray-900 hover:text-blue-600 transition duration-300 transform hover:scale-105"
              >
                My Profile
              </Link>
            )}

            {/* Conditional Login/Logout */}
            {!currentUser ? (
              <>
                <Link
                  to="/login"
                  className="text-gray-900 hover:text-blue-600 transition duration-300 transform hover:scale-105"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-gray-900 hover:text-blue-600 transition duration-300 transform hover:scale-105"
                >
                  Register
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-all duration-300 transform hover:scale-105"
              >
                Logout
              </button>
            )}
          </div>
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
