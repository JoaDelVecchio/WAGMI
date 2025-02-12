import { Request, Response, NextFunction } from "express";
import PortfolioModel from "../models/Portfolio";
import TokenModel, { IToken } from "../models/Token";
import AppError from "../lib/AppError";

export const addToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { portfolioId } = req.params;
  const { contract, amount } = req.body;

  try {
    if (!portfolioId || !contract || amount === undefined) {
      throw new AppError(
        "Missing parameters (portfolioId, contract, or amount)",
        400
      );
    }

    // Find portfolio
    const portfolio = await PortfolioModel.findById(portfolioId);
    if (!portfolio) throw new AppError("Portfolio not found", 404);

    // Check if token exists in global database
    let token = (await TokenModel.findOne({ contract })) as IToken | null;

    // If token does NOT exist globally, fetch from API and create it
    if (!token) {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/ethereum/contract/${contract}`
      );
      if (!response.ok)
        throw new AppError("Failed to fetch token details from CoinGecko", 500);

      const data = await response.json();
      if (!data.symbol || !data.name || !data.market_data?.current_price?.usd) {
        throw new AppError("Invalid token data received", 500);
      }

      token = (await TokenModel.create({
        contract,
        symbol: data.symbol,
        name: data.name,
        price: data.market_data.current_price.usd,
      })) as IToken;
    }

    // Check if token already exists in portfolio
    const existingToken = portfolio.tokens.find(
      (t) =>
        t.tokenId && token && t.tokenId.toString() === token!._id.toString()
    );

    if (existingToken) {
      // Update token amount if it already exists
      existingToken.amount = amount;
    } else {
      // Add new token to portfolio
      portfolio.tokens.push({ tokenId: token._id, amount });
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
    if (!portfolioId || !tokenId) {
      throw new AppError("Missing parameters (portfolioId or contract)", 400);
    }

    // Find portfolio
    const portfolio = await PortfolioModel.findById(portfolioId);
    if (!portfolio) throw new AppError("Portfolio not found", 404);

    // Remove token from portfolio
    const token = portfolio.tokens.find(
      (token) => token.tokenId.toString() == tokenId
    );
    if (!token) throw new AppError("Token not found in portfolio", 404);

    const updatedTokens = portfolio.tokens.filter(
      (t) => t.tokenId !== token.tokenId
    );

    portfolio.tokens = updatedTokens;
    await portfolio.save();

    console.log("Token deleted successfully");
    res
      .status(200)
      .json({ message: "Token removed successfully", data: token });
  } catch (error) {
    next(error);
  }
};
