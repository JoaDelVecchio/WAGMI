import { Request, Response, NextFunction } from "express";
import PortfolioModel from "../models/Portfolio";
import TokenModel from "../models/Token";
import AppError from "../lib/AppError";

const COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3";

// 🟢 ADD TOKEN TO PORTFOLIO
export const addToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { portfolioId } = req.params;
  const { contract, amount, chain } = req.body; // ✅ Chain is required

  try {
    if (!portfolioId || !contract || amount === undefined || !chain) {
      throw new AppError(
        "Missing parameters (portfolioId, contract, amount, or chain)",
        400
      );
    }

    // 🟢 Find Portfolio
    const portfolio = await PortfolioModel.findById(portfolioId);
    if (!portfolio) throw new AppError("Portfolio not found", 404);

    // 🟢 Check if Token Exists in DB
    let token = await TokenModel.findOne({ contract });

    if (!token) {
      let apiUrl: string;

      // 🔥 Detect blockchain and set the correct API endpoint
      switch (chain.toLowerCase()) {
        case "ethereum":
          apiUrl = `${COINGECKO_BASE_URL}/coins/ethereum/contract/${contract}`;
          break;
        case "solana":
          apiUrl = `${COINGECKO_BASE_URL}/coins/solana/contract/${contract}`;
          break;
        case "binance-smart-chain":
          apiUrl = `${COINGECKO_BASE_URL}/coins/binance-smart-chain/contract/${contract}`;
          break;
        case "polygon":
          apiUrl = `${COINGECKO_BASE_URL}/coins/polygon-pos/contract/${contract}`;
          break;
        case "avalanche":
          apiUrl = `${COINGECKO_BASE_URL}/coins/avalanche/contract/${contract}`;
          break;
        case "fantom":
          apiUrl = `${COINGECKO_BASE_URL}/coins/fantom/contract/${contract}`;
          break;
        default:
          // 🔥 If it's not a smart contract token, try fetching it by CoinGecko ID
          apiUrl = `${COINGECKO_BASE_URL}/coins/${contract.toLowerCase()}`;
          break;
      }

      console.log(`Fetching token data from: ${apiUrl}`);

      // 🟢 Fetch from CoinGecko
      const response = await fetch(apiUrl);
      if (!response.ok) {
        console.error("Failed to fetch token details:", response.statusText);
        throw new AppError("Failed to fetch token details", 500);
      }

      const data = await response.json();

      // ✅ Validate response
      if (!data.symbol || !data.name || !data.market_data?.current_price?.usd) {
        throw new AppError("Invalid token data received", 500);
      }

      // ✅ Save token to DB
      token = await TokenModel.create({
        contract,
        symbol: data.symbol.toUpperCase(),
        name: data.name,
        price: data.market_data.current_price.usd,
        image: data.image.large,
      });
    }

    // 🟢 Check if Token Already Exists in Portfolio
    const existingToken = portfolio.tokens.find(
      (t) => t._id.toString() === token!._id.toString()
    );

    if (existingToken) {
      // ✅ Update amount if it already exists
      existingToken.amount = amount;
    } else {
      // ✅ Add new token to portfolio
      portfolio.tokens.push({ _id: token._id, amount });
    }

    await portfolio.save();
    res.status(200).json({ message: "Token added successfully", data: token });
  } catch (error) {
    next(error);
  }
};

export const deleteToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { portfolioId, tokenId } = req.params;

  try {
    // Validate params
    if (!portfolioId || !tokenId) {
      throw new AppError("Missing parameters (portfolioId or tokenId)", 400);
    }

    // 🟢 Find Portfolio
    const portfolio = await PortfolioModel.findById(portfolioId);
    if (!portfolio) throw new AppError("Portfolio not found", 404);

    // 🟢 Find Token in Portfolio
    const tokenIndex = portfolio.tokens.findIndex(
      (t) => t._id.toString() === tokenId
    );

    if (tokenIndex === -1) {
      throw new AppError("Token not found in portfolio", 404);
    }

    // 🟢 Remove Token from Portfolio
    portfolio.tokens.splice(tokenIndex, 1);
    await portfolio.save();

    res.status(200).json({ message: "Token removed successfully" });
  } catch (error) {
    next(error);
  }
};

// ✏️ UPDATE TOKEN AMOUNT
export const updateTokenAmount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { portfolioId, tokenId } = req.params;
  let { amount } = req.body;

  console.log("Received amount:", amount); // Debugging

  if (!portfolioId || !tokenId || amount === undefined || amount === null) {
    return res
      .status(400)
      .json({ message: "Missing parameters (portfolioId, tokenId, amount)" });
  }

  // 🔥 Ensure `amount` is a NUMBER
  amount = Number(amount);
  if (isNaN(amount) || amount <= 0) {
    return res
      .status(400)
      .json({ message: "Invalid amount. Must be a positive number." });
  }

  try {
    const portfolio = await PortfolioModel.findById(portfolioId);
    if (!portfolio)
      return res.status(404).json({ message: "Portfolio not found" });

    const token = portfolio.tokens.find((t) => t._id.toString() === tokenId);
    if (!token)
      return res.status(404).json({ message: "Token not found in portfolio" });

    token.amount = amount; // ✅ Now it's guaranteed to be a NUMBER
    await portfolio.save();

    res
      .status(200)
      .json({ message: "Token amount updated successfully", data: token });
  } catch (error) {
    console.error("Error updating token:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
