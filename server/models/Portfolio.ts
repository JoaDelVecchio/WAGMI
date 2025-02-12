import { Schema, model, Document, Types } from "mongoose";

interface IPortfolio extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  portfolioName: string;
  tokens: { tokenId: Types.ObjectId; amount: number }[];
}

const PortfolioSchema = new Schema<IPortfolio>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    portfolioName: { type: String, required: true },
    tokens: [
      {
        tokenId: { type: Schema.Types.ObjectId, ref: "Token" },
        amount: { type: Number, required: true, default: 0 },
      },
    ],
  },
  { timestamps: true }
);

export default model<IPortfolio>("Portfolio", PortfolioSchema);
