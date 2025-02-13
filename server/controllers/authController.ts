import { Request, Response, NextFunction } from "express";
import AppError from "../lib/AppError";
import UserModel from "../models/User";
import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../config";

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

    const age = 7 * 24 * 60 * 60 * 1000;
    const token = jwt.sign({ id: user._id }, JWT_SECRET_KEY, {
      expiresIn: age,
    });

    console.log("Logged in successfully");
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none", //
      })
      .status(201)
      .json({ message: "User logged in successfully", data: user });
  } catch (error) {
    next(error);
  }
};

export const logout = (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("Logged out successfully");
    res
      .clearCookie("token")
      .status(200)
      .json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};
