import AppError from "../lib/AppError";
import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY, NODE_ENV } from "../config";
import { Request, Response, NextFunction } from "express";
import UserModel from "../models/User";
import { IAuthRequest } from "../types";

export const getAuthenticatedUser = async (
  req: IAuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await UserModel.findById(req.userId).select("-password");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, username, password } = req.body;
  try {
    if (!email || !password || !username)
      throw new AppError("Email, Username and/or Password are missing", 400);

    const isDuplicated = await UserModel.findOne({ email });

    if (isDuplicated)
      throw new AppError("There is already an account with that email", 400);

    const newUser = new UserModel({ email, password, username });
    await newUser.save();

    console.log("User was created successfully");
    res
      .status(200)
      .json({ message: "User created successfully", data: newUser });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  try {
    if (!email || !password)
      throw new AppError("Email and/or Password are missing", 400);

    const user = await UserModel.findOne({ email });
    if (!user) throw new AppError("Invalid Credentials", 403);

    const isValid = await user.comparePassword(password);
    if (!isValid) throw new AppError("Invalid Credentials", 403);

    const age = 7 * 24 * 60 * 60 * 1000; // 7 days expiration
    const token = jwt.sign({ id: user._id }, JWT_SECRET_KEY, {
      expiresIn: age / 1000,
    });

    console.log("✅ Logged in successfully, setting cookie...");

    res
      .cookie("token", token, {
        httpOnly: true, // ✅ Secure from JavaScript access
        secure: NODE_ENV === "production", // ✅ Secure mode only in production
        sameSite: "none", // ✅ Needed for cross-origin requests
      })
      .status(200)
      .json({ message: "User logged in successfully", data: user });
  } catch (error) {
    next(error);
  }
};

export const logout = (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("Logged out successfully");

    res
      .clearCookie("token", {
        httpOnly: true,
        secure: NODE_ENV === "production",
        sameSite: "none",
      })
      .status(200)
      .json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};
