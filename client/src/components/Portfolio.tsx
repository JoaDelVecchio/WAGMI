import { useState, useEffect } from "react";
import { API_BASE_URL } from "../config";
import Token from "./Token";
import { useAuthContext } from "../context/AuthContextProvider";

const Portfolio = () => {
  const { portfolio, error, loading, setPortfolio } = useAuthContext();
  const [tokens, setTokens] = useState<Array<{ _id: any; amount: number }>>(
    portfolio?.tokens || [],
  );
  const [newTokenContract, setNewTokenContract] = useState("");
  const [newTokenAmount, setNewTokenAmount] = useState<number>(0);
  const [newTokenChain, setNewTokenChain] = useState("");
  const [addingToken, setAddingToken] = useState(false);

  useEffect(() => {
    setTokens(portfolio?.tokens || []);
  }, [portfolio]);

  const handleDeleteToken = async (tokenId: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/tokens/${portfolio?._id}/${tokenId}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete token");
      }

      setTokens((prevTokens) =>
        prevTokens.filter((t) => t._id._id !== tokenId),
      );
      setPortfolio((prevPortfolio) => {
        return prevPortfolio
          ? {
              ...prevPortfolio,
              tokens: prevPortfolio.tokens.filter((t) => t._id._id !== tokenId),
            }
          : prevPortfolio;
      });
    } catch (error) {
      console.error("Error deleting token:", error);
    }
  };

  const handleUpdateAmount = async (tokenId: string, newAmount: any) => {
    if (!portfolio?._id) {
      console.error("Error: Portfolio ID is missing");
      return;
    }

    // 🔥 Ensure the newAmount is a valid number
    const parsedAmount = Number(newAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      console.error("Error: Invalid amount", newAmount);
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/tokens/${portfolio._id}/${tokenId}`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: parsedAmount }), // ✅ Ensure number format
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update token amount");
      }

      const updatedToken = await response.json();

      setTokens((prevTokens) =>
        prevTokens.map((t) =>
          t._id._id === tokenId
            ? { ...t, amount: updatedToken.data.amount }
            : t,
        ),
      );

      setPortfolio((prevPortfolio) => {
        return prevPortfolio
          ? {
              ...prevPortfolio,
              tokens: prevPortfolio.tokens.map((t) =>
                t._id._id === tokenId
                  ? { ...t, amount: updatedToken.data.amount }
                  : t,
              ),
            }
          : prevPortfolio;
      });
    } catch (error) {
      console.error("Error updating token amount:", error);
    }
  };

  const handleAddToken = async () => {
    if (!newTokenContract || newTokenAmount <= 0 || !newTokenChain) return;
    setAddingToken(true);

    try {
      const response = await fetch(`${API_BASE_URL}/tokens/${portfolio?._id}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contract: newTokenContract,
          amount: newTokenAmount,
          chain: newTokenChain,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add token.");
      }

      // ✅ Fetch updated portfolio after adding token
      const portfolioResponse = await fetch(`${API_BASE_URL}/portfolio`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (!portfolioResponse.ok) {
        throw new Error("Failed to fetch portfolio after adding token.");
      }

      const updatedPortfolio = await portfolioResponse.json();
      setPortfolio(updatedPortfolio.data); // ✅ Ensure complete data

      setNewTokenContract("");
      setNewTokenAmount(0);
      setNewTokenChain("");
    } catch (error) {
      console.error("Error adding token:", error);
    } finally {
      setAddingToken(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg w-full mx-auto">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
        {portfolio?.portfolioName}
      </h1>

      {/* 🟢 Add Token Section */}
      <div className="bg-white p-6 rounded-lg shadow-md max-w-full">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Add Token</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}

        <input
          type="text"
          placeholder="Enter Contract Address / Token ID"
          value={newTokenContract}
          disabled={loading}
          onChange={(e) => setNewTokenContract(e.target.value)}
          className="w-full px-4 py-2 mb-3 border rounded-md"
        />

        <input
          type="number"
          placeholder="Enter Amount"
          value={newTokenAmount}
          onChange={(e) => setNewTokenAmount(Number(e.target.value))}
          className="w-full px-4 py-2 mb-3 border rounded-md"
        />

        <select
          value={newTokenChain}
          onChange={(e) => setNewTokenChain(e.target.value)}
          className="w-full px-4 py-2 mb-3 border rounded-md"
        >
          <option value="">Select Blockchain</option>
          <option value="ethereum">Ethereum (ETH)</option>
          <option value="solana">Solana (SOL)</option>
          <option value="binance-smart-chain">Binance Smart Chain (BSC)</option>
          <option value="polygon">Polygon (MATIC)</option>
          <option value="avalanche">Avalanche (AVAX)</option>
          <option value="fantom">Fantom (FTM)</option>
        </select>

        <button
          onClick={handleAddToken}
          className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition hover:bg-blue-700"
          disabled={addingToken}
        >
          {addingToken ? "Adding..." : "Add Token"}
        </button>
      </div>

      {/* 🟡 Tokens List */}
      <div className="grid gap-6 mt-6">
        {tokens?.map((token, index) => (
          <Token
            key={token._id?._id || index}
            token={token}
            onDelete={() => handleDeleteToken(token._id._id)}
            onUpdateAmount={(tokenId, newAmount) =>
              handleUpdateAmount(tokenId, newAmount)
            }
          />
        ))}
      </div>
    </div>
  );
};

export default Portfolio;
