import { Document, Types } from "mongoose";
import { Request } from "express";
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IAuthRequest extends Request {
  userId?: string;
}

export interface IToken {
  contract: string;
  amount: number;
  price: number;
  name: string;
  symbol: string;
}

export interface IPortfolio extends Document {
  userId: Types.ObjectId;
  portfolioName: string;
  tokens: IToken[];
}
