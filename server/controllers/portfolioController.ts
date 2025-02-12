import { Response, NextFunction } from "express";
import { IAuthRequest } from "../types";
import PortfolioModel from "../models/Portfolio";
import AppError from "../lib/AppError";
import { Types } from "mongoose";
import User from "../models/User";

export const getPortfolio = async (
  req: IAuthRequest,
  res: Response,
  next: NextFunction
) => {
  const portfolioId = req.params.portfolioId;

  try {
    if (!portfolioId) throw new AppError("Missing portfolio identifier", 404);

    const portfolio = await PortfolioModel.findById(portfolioId).populate({
      path: "tokens.tokenId",
      model: "Token",
    });

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
    const user = await User.findById(userId);

    if (!user) throw new AppError("User not found", 404);

    if (!portfolioName) throw new AppError("Name is missing", 400);

    const portfolio = new PortfolioModel({
      portfolioName,
      userId,
      tokens: [],
    });

    user.portfolios.push(portfolio._id);

    await portfolio.save();
    await user.save();

    console.log("New protfolio created successfully");
    res
      .status(201)
      .json({ message: "New portfolio created successfully", data: portfolio });
  } catch (error) {
    next(error);
  }
};
