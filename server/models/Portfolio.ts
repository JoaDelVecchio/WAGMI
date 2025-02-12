import { Schema, model } from "mongoose";
import { IPortfolio, IToken } from "../types";

const TokenSchema = new Schema<IToken>(
  {
    amount: { type: Number, required: true, default: 0 },
    contract: { type: String, required: true },
    price: { type: Number, required: true },
    name: { type: String, required: true },
    symbol: { type: String, required: true },
  },
  { timestamps: true }
);

const PortfolioSchema = new Schema<IPortfolio>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Each portfolio should have an unique User Identifier"],
    },
    portfolioName: { type: String, required: true },
    tokens: { type: [TokenSchema] },
  },
  { timestamps: true }
);

const PortfolioModel = model<IPortfolio>("Portfolio", PortfolioSchema);
export default PortfolioModel;
