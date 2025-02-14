import AppError from "../lib/AppError";
import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY, NODE_ENV } from "../config";
import { Request, Response, NextFunction } from "express";
import UserModel from "../models/User";
import { IAuthRequest } from "../types";
import User from "../models/User";
import bcrypt from "bcryptjs";

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
      throw new AppError("Missing fields, try again!", 400);

    const user = await User.findOne({ email });
    if (!user) throw new AppError("Invalid Credentials", 403);

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) throw new AppError("Invalid Credentials", 403);

    const age = 7 * 24 * 60 * 60 * 1000; // 7 days expiration
    const token = jwt.sign({ id: user._id }, JWT_SECRET_KEY, {
      expiresIn: age,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict", //
    });

    res.status(200).json(user);
    console.log("✅ Logged in successfully");
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
