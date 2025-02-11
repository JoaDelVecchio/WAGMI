import { Request, Response, NextFunction } from "express";
import AppError from "../lib/AppError";
import { NODE_ENV } from "../config";

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const message = NODE_ENV === "development" ? err.stack : err.message;

  if (err instanceof AppError) {
    console.error(`[AppError] Status:${err.status} Error:${message}`);
    res.status(err.status).json({ message: err.message });
    return;
  } else if (err instanceof Error) {
    console.error(`[Error] ${message}`);
    res
      .status(500)
      .json({ message: message || "Unexpected Error, try again later!" });
    return;
  } else {
    console.error("Unexpected Error", err);
    res.status(500).json("Unexpected Error, Try again later!");
    return;
  }
};

export default errorHandler;
