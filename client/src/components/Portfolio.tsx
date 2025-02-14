import { useState } from "react";
import { API_BASE_URL } from "../config";
import { IPortfolio } from "../types";
import Token from "./Token";

const Portfolio = ({ portfolio }: { portfolio: IPortfolio }) => {
  const [tokens, setTokens] = useState(portfolio.tokens);
  const [newTokenContract, setNewTokenContract] = useState("");
  const [newTokenAmount, setNewTokenAmount] = useState<number>(0);
  const [newTokenChain, setNewTokenChain] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🟢 Add Token Function
  const handleAddToken = async () => {
    if (!newTokenContract || newTokenAmount <= 0 || !newTokenChain) {
      setError(
        "Please enter a valid contract address, amount, and blockchain.",
      );
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/tokens/${portfolio._id}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contract: newTokenContract,
          amount: newTokenAmount,
          chain: newTokenChain, // ✅ Include blockchain type
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add token.");
      }

      const data = await response.json();

      // ✅ Update token list in state
      setTokens((prevTokens) => [
        ...prevTokens,
        { _id: data.data, amount: newTokenAmount },
      ]);

      // ✅ Reset input fields
      setNewTokenContract("");
      setNewTokenAmount(0);
      setNewTokenChain("");
    } catch (error) {
      setError((error as Error).message || "Failed to add token.");
      console.error("Error adding token:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🗑️ Delete Token Function
  const handleDeleteToken = async (tokenId: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/tokens/${portfolio._id}/${tokenId}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      // ✅ Update state without reloading
      setTokens((prevTokens) =>
        prevTokens.filter((t) => t._id._id !== tokenId),
      );
    } catch (error) {
      console.error("Failed to delete token:", error);
    }
  };

  // ✏️ Update Token Amount Function
  const handleUpdateAmount = async (tokenId: string, newAmount: number) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/tokens/${portfolio._id}/${tokenId}`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: newAmount }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      // ✅ Update state without reloading
      setTokens((prevTokens) =>
        prevTokens.map((t) =>
          t._id._id === tokenId ? { ...t, amount: newAmount } : t,
        ),
      );
    } catch (error) {
      console.error("Failed to update token amount:", error);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg w-full  mx-auto">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
        {portfolio.portfolioName}
      </h1>

      {/* 🟢 Add Token Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Add Token</h2>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <input
          type="text"
          placeholder="Enter Contract Address / Token ID"
          value={newTokenContract}
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
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Token"}
        </button>
      </div>

      {/* 🟠 Error Message */}
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {/* 🟡 Tokens List */}
      <div className="grid gap-6">
        {tokens.map((token) => (
          <Token
            key={token._id._id}
            token={token}
            onDelete={handleDeleteToken}
            onUpdateAmount={handleUpdateAmount}
          />
        ))}
      </div>
    </div>
  );
};

export default Portfolio;
