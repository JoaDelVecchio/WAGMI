import { Response, NextFunction } from "express";
import { IAuthRequest } from "../types";
import PortfolioModel from "../models/Portfolio";
import AppError from "../lib/AppError";
import User from "../models/User";
import TokenModel, { IToken } from "../models/Token";

const COINGECKO_API_URL =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana&order=market_cap_desc&per_page=3&page=1&sparkline=false";

// ✅ Fetch Tokens from CoinGecko
const fetchEssentialTokenData = async () => {
  try {
    const response = await fetch(COINGECKO_API_URL);
    if (!response.ok) throw new Error("Failed to fetch token data");

    const data = await response.json();

    return data.map((token: any) => ({
      contract: token.id, // Using ID as contract (no actual contract for BTC/ETH/SOL)
      symbol: token.symbol.toUpperCase(),
      name: token.name,
      price: token.current_price,
      image: token.image, // ✅ Stores Image
    }));
  } catch (error) {
    console.error("Error fetching CoinGecko data:", error);
    return null;
  }
};

// ✅ Create Portfolio
export const createPortfolio = async (
  req: IAuthRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;
  const { portfolioName } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) throw new AppError("User not found", 404);
    if (!portfolioName) throw new AppError("Portfolio name is required", 400);

    // 🟢 Fetch essential tokens
    const essentialTokenData = await fetchEssentialTokenData();
    if (!essentialTokenData)
      throw new AppError("Failed to fetch token data", 500);

    // 🟠 Ensure tokens exist in database
    const tokenReferences = await Promise.all(
      essentialTokenData.map(async (token: IToken) => {
        let existingToken = await TokenModel.findOne({
          contract: token.contract,
        });

        if (!existingToken) {
          existingToken = await TokenModel.create({
            contract: token.contract,
            symbol: token.symbol,
            name: token.name,
            price: token.price,
            image: token.image,
          });
        }

        return { _id: existingToken._id, amount: 0 };
      })
    );

    // 🔹 Create Portfolio with Token References
    const portfolio = new PortfolioModel({
      portfolioName,
      userId,
      tokens: tokenReferences,
    });

    await portfolio.save();
    res
      .status(201)
      .json({ message: "Portfolio created successfully", data: portfolio });
  } catch (error) {
    next(error);
  }
};

// ✅ Get Portfolio
export const getPortfolio = async (
  req: IAuthRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId);
    if (!user) throw new AppError("User not found", 404);

    const portfolio = await PortfolioModel.findOne({ userId }).populate(
      "tokens._id"
    );

    res
      .status(200)
      .json({ message: "Portfolio retrieved successfully", data: portfolio });
  } catch (error) {
    next(error);
  }
};
