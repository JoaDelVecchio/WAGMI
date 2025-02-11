import { Request, Response, NextFunction } from "express";
import AppError from "../lib/AppError";
import UserModel from "../models/User";

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
    console.log("User was created succesfully");
    res
      .status(200)
      .json({ message: "User created succesfully", data: newUser });
  } catch (error) {
    next(error);
  }
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  try {
  } catch (error) {}
};

export const logout = (req: Request, res: Response, next: NextFunction) => {
  try {
  } catch (error) {}
};
