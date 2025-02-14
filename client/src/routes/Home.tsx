import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import { IPortfolio } from "../types";
import Portfolio from "../components/Portfolio";

// Main Home Component
const Home = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [portfolio, setPortfolio] = useState<IPortfolio | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      setError(null);
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/portfolio`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message);
        }
        const data = await response.json();
        setPortfolio(data.data);
      } catch (error) {
        setError((error as Error).message || "Failed to fetch portfolio");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p className="text-center text-lg">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="flex justify-center items-center min-h-full p-4">
      {portfolio ? (
        <Portfolio portfolio={portfolio} />
      ) : (
        <p>No portfolio found.</p>
      )}
    </div>
  );
};

export default Home;
