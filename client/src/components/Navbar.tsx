import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContextProvider";
import { API_BASE_URL } from "../config";

const Navbar = () => {
  const { currentUser, updateUser } = useAuthContext();
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasPortfolio, setHasPortfolio] = useState<boolean | null>(null);
  const [showCreatePortfolio, setShowCreatePortfolio] = useState(false);
  const [portfolioName, setPortfolioName] = useState("");
  const navigate = useNavigate();
  // 🟢 Fetch Portfolio Status
  useEffect(() => {
    const fetchPortfolio = async () => {
      if (!currentUser) return;
      try {
        const response = await fetch(`${API_BASE_URL}/portfolio`, {
          credentials: "include",
        });

        if (response.ok) {
          setHasPortfolio(true);
        } else {
          setHasPortfolio(false);
        }
      } catch (error) {
        setHasPortfolio(false);
      }
    };

    fetchPortfolio();
  }, [currentUser]);

  // 🔥 Handle Create Portfolio
  const handleCreatePortfolio = async () => {
    if (!portfolioName.trim()) {
      setError("Portfolio name cannot be empty.");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/portfolio`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ portfolioName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      setHasPortfolio(true); // ✅ Portfolio created, update UI
      setShowCreatePortfolio(false);
      setPortfolioName(""); // Reset input
    } catch (error) {
      setError("Failed to create portfolio.");
    } finally {
      setLoading(false);
    }
  };

  // 🔴 Handle Logout
  const handleLogout = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include", // ✅ Ensure cookie is cleared
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      // ✅ Reset user state
      updateUser(undefined);
      navigate("/profile/login");
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (error) return <p className="text-red-500 font-bold">{error}</p>;
  return (
    <nav className="bg-white/30 backdrop-blur-md py-4 px-6 fixed top-0 left-0 right-0 w-full z-50 shadow-md transition-all duration-300">
      <div className="flex justify-between items-center max-w-screen-xl mx-auto">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-all duration-300 transform hover:scale-105"
        >
          WAGMI 🚀
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-6">
          {currentUser && (
            <Link
              to="/"
              className="text-gray-900 hover:text-blue-600 transition-all duration-300 transform hover:scale-105"
            >
              {currentUser.username}
            </Link>
          )}

          {/* 🔹 Show "Create Portfolio" Button if No Portfolio */}
          {currentUser && hasPortfolio === false && (
            <button
              onClick={() => setShowCreatePortfolio(true)}
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-all duration-300 transform hover:scale-105"
            >
              Create Portfolio
            </button>
          )}

          {/* 🔹 Create Portfolio Input Form */}
          {showCreatePortfolio && (
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Portfolio Name"
                value={portfolioName}
                onChange={(e) => setPortfolioName(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleCreatePortfolio}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-all duration-300"
              >
                {loading ? "Creating..." : "Save"}
              </button>
            </div>
          )}

          {!currentUser ? (
            <>
              <Link
                to="/profile/login"
                className="text-gray-900 hover:text-blue-600 transition-all duration-300 transform hover:scale-105"
              >
                Login
              </Link>
              <Link
                to="/profile/register"
                className="text-gray-900 hover:text-blue-600 transition-all duration-300 transform hover:scale-105"
              >
                Register
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-all duration-300 transform hover:scale-105"
            >
              {loading ? "Logging out..." : "Logout"}
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden text-gray-900 hover:text-gray-600 focus:outline-none transition-all duration-300"
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

      {/* Mobile Dropdown Menu */}
      <div
        className={`absolute top-16 left-0 w-full bg-white/90 backdrop-blur-md shadow-md transform transition-all duration-300 ${
          isOpen
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        } lg:hidden`}
      >
        <div className="flex flex-col space-y-4 py-4 px-6">
          {currentUser && (
            <Link
              to="/"
              className="text-gray-900 hover:text-blue-600 transition-all duration-300 transform hover:scale-105"
            >
              {currentUser.username}
            </Link>
          )}

          {/* Mobile View: Create Portfolio */}
          {currentUser && hasPortfolio === false && (
            <button
              onClick={() => setShowCreatePortfolio(true)}
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-all duration-300"
            >
              Create Portfolio
            </button>
          )}

          {showCreatePortfolio && (
            <div className="flex flex-col space-y-2">
              <input
                type="text"
                placeholder="Portfolio Name"
                value={portfolioName}
                onChange={(e) => setPortfolioName(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleCreatePortfolio}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-all duration-300"
              >
                {loading ? "Creating..." : "Save"}
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
