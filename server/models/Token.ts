import { Schema, model, Document, Types } from "mongoose";

export interface IToken extends Document {
  _id: Types.ObjectId;
  contract: string;
  symbol: string;
  name: string;
  price: number;
  image: string; // ✅ Added Image Field
}

const TokenSchema = new Schema<IToken>(
  {
    contract: { type: String, required: true, unique: true },
    symbol: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true }, // ✅ Added Image Field
  },
  { timestamps: true }
);

export default model<IToken>("Token", TokenSchema);
