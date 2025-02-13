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
  const userId = req.userId;

  try {
    const user = await User.findById(userId);

    if (!user) throw new AppError("User does not exist with that id", 404);

    const portfolio = await PortfolioModel.findOne({ userId });

    if (!portfolio)
      throw new AppError("That user does not have a portfolio", 404);

    console.log("Fetched portfolio successfully", portfolio);
    res.status(200).json({
      message: "Fetched portfolio successfully",
      data: portfolio.toObject(),
    });
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
