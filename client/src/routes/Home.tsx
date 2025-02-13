import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import { IPortfolio } from "../types";

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
        console.log(data);
        setPortfolio(data.data);
        console.log(data.message);
      } catch (error) {
        setError((error as Error).message || "Failed to fetch portfolios");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  return (
    <div>
      <h1>PORTFOLIO:{portfolio?.portfolioName}</h1>
    </div>
  );
};

export default Home;
