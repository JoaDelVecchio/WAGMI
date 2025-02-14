import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContextProvider";
import { API_BASE_URL } from "../config";

const Navbar = () => {
  const {
    currentUser,
    updateUser,
    portfolio,
    setPortfolio,
    loading,
    fetchPortfolio,
  } = useAuthContext();
  const [error, setError] = useState<string | null>(null);
  const [loadingLogout, setLoadingLogout] = useState(false);
  const [loadingPortfolio, setLoadingPortfolio] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [portfolioName, setPortfolioName] = useState("");
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      setLoadingLogout(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to logout");

      updateUser(undefined);
      setPortfolio(undefined);
      navigate("/profile/login");
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoadingLogout(false);
    }
  };

  const handleCreatePortfolio = async () => {
    if (!portfolioName.trim()) return;

    try {
      setLoadingPortfolio(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/portfolio`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ portfolioName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create portfolio");
      }

      console.log("Portfolio created, refetching...");
      await fetchPortfolio(); // ✅ Immediately refetch portfolio
      navigate("/portfolio"); // ✅ Redirect to portfolio page
      setShowInput(false);
      setPortfolioName("");
    } catch (error) {
      console.error("Error creating portfolio:", error);
    } finally {
      setLoadingPortfolio(false);
    }
  };

  return (
    <>
      <nav className="bg-white/30 backdrop-blur-md py-4 px-6 fixed top-0 left-0 right-0 w-full z-50 shadow-md transition-all duration-300">
        <div className="flex justify-between items-center max-w-screen-xl mx-auto">
          <Link
            to="/"
            className="text-2xl font-bold text-gray-900 hover:text-blue-600"
          >
            WAGMI 🚀
          </Link>

          {error && <p className="text-red-500">{error}</p>}

          {currentUser && !loading && !portfolio && (
            <button
              onClick={() => setShowInput(true)}
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
              disabled={loadingPortfolio}
            >
              {loadingPortfolio ? "Creating..." : "Create Portfolio"}
            </button>
          )}

          {currentUser && (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
            >
              {loadingLogout ? "Logging out..." : "Logout"}
            </button>
          )}
        </div>
      </nav>

      {showInput && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/50 backdrop-blur-md z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-sm transition-all transform animate-fade-in">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
              Enter Portfolio Name
            </h2>

            <input
              type="text"
              value={portfolioName}
              onChange={(e) => setPortfolioName(e.target.value)}
              placeholder="Portfolio Name"
              className="w-full px-4 py-2 mb-3 border rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex justify-center gap-4">
              <button
                onClick={handleCreatePortfolio}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-all"
                disabled={loadingPortfolio}
              >
                {loadingPortfolio ? "Creating..." : "Confirm"}
              </button>
              <button
                onClick={() => setShowInput(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
