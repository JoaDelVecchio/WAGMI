import { Schema, model, Document, Types } from "mongoose";

export interface IToken extends Document {
  _id: Types.ObjectId;
  contract: string;
  symbol: string;
  name: string;
  price: number;
}

const TokenSchema = new Schema<IToken>(
  {
    contract: { type: String, required: true, unique: true },
    symbol: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

export default model<IToken>("Token", TokenSchema);
