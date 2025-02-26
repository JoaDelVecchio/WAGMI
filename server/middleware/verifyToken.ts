import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../config";
import AppError from "../lib/AppError";
import { IAuthRequest } from "../types";

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;
    if (!token) throw new AppError("You are not Authenticated", 403);

    jwt.verify(
      token,
      JWT_SECRET_KEY,
      (err: jwt.VerifyErrors | null, payload: any) => {
        if (err) throw new AppError("Invalid Token", 403);

        (req as unknown as IAuthRequest).userId = payload.id;
        next();
      }
    );
  } catch (error) {
    next(error);
  }
};

export default verifyToken;
