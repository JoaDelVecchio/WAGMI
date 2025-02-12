import { Request, Response, NextFunction, application } from "express";
import { IAuthRequest, IToken } from "../types";
import PortfolioModel from "../models/Portfolio";
import AppError from "../lib/AppError";
import { Types } from "mongoose";

export const getPortfolio = async (
  req: IAuthRequest,
  res: Response,
  next: NextFunction
) => {
  const portfolioId = req.params.portfolioId;

  try {
    if (!portfolioId) throw new AppError("Missing portfolio identifier", 404);

    const portfolio = await PortfolioModel.findById({ portfolioId });

    if (!portfolio)
      throw new AppError("There is no portfolio with that Id", 404);

    console.log("Fetched portfolio successfully");
    res
      .status(200)
      .json({ message: "Fetched portfolio successfully", data: portfolio });
  } catch (error) {
    next(error);
  }
};

export const createPortfolio = async (
  req: IAuthRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;

  const { portfolioName } = req.body;

  try {
    if (!portfolioName) throw new AppError("Name is missing", 400);

    const portfolio = new PortfolioModel({
      portfolioName,
      userId: new Types.ObjectId(userId),
      tokens: [],
    });

    await portfolio.save();
    console.log("New protfolio created successfully");
    res
      .status(201)
      .json({ message: "New portfolio created successfully", data: portfolio });
  } catch (error) {
    next(error);
  }
};

export const addToken = async (
  req: IAuthRequest,
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

    // Find portfolio by ID
    const portfolio = await PortfolioModel.findById(portfolioId);
    if (!portfolio)
      throw new AppError("There is no portfolio with that Id", 404);

    // Fetch token details from CoinGecko
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/ethereum/contract/${contract}`
    );
    if (!response.ok)
      throw new AppError("Failed to fetch token details from CoinGecko", 500);

    const data = await response.json();

    if (!data.symbol || !data.name || !data.market_data?.current_price?.usd) {
      throw new AppError("Invalid token data received", 500);
    }

    // Check if token already exists in portfolio
    const existingToken = portfolio.tokens.find((t) => t.contract === contract);

    if (existingToken) {
      existingToken.amount = amount;
    } else {
      const newToken = {
        contract,
        amount,
        symbol: data.symbol,
        name: data.name,
        price: data.market_data.current_price.usd,
      };

      // Add new token to the portfolio
      portfolio.tokens.push({
        contract,
        amount,
        symbol: data.symbol,
        name: data.name,
        price: data.market_data.current_price.usd,
      });
    }

    // Save portfolio
    await portfolio.save();

    console.log("Token added successfully");
    res
      .status(200)
      .json({ message: "Token added successfully", data: portfolio });
  } catch (error) {
    next(error);
  }
};

export const deleteToken = async (
  req: IAuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
  } catch (error) {
    next(error);
  }
};
