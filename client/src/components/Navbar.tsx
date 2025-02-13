import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../context/AuthContextProvider";
import { API_BASE_URL } from "../config";

const Navbar = () => {
  const { currentUser, updateUser } = useAuthContext();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const handleLogout = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const data = await response.json();
      updateUser(data.data);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (error) return <p className="text-red-500 font-bold">{error}</p>;

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
                to="/"
                className="text-gray-900 hover:text-blue-600 transition duration-300 transform hover:scale-105"
              >
                {currentUser.username}
              </Link>
            )}

            {/* Conditional Login/Logout */}
            {!currentUser ? (
              <>
                <Link
                  to="/profile/login"
                  className="text-gray-900 hover:text-blue-600 transition duration-300 transform hover:scale-105"
                >
                  Login
                </Link>
                <Link
                  to="/profile/register"
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
                {loading ? "Loggin out" : "Logout"}
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
