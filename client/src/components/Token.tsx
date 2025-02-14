import { useState } from "react";
import { IToken } from "../types";

interface TokenProps {
  token: {
    _id: IToken;
    amount: number;
  };
  onDelete: (id: string) => void;
  onUpdateAmount: (id: string, newAmount: number) => void;
}

const Token = ({ token, onDelete, onUpdateAmount }: TokenProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newAmount, setNewAmount] = useState(token.amount);

  return (
    <div className="flex flex-wrap md:flex-nowrap items-center justify-between p-6 gap-6 bg-white shadow-md rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-105 border border-gray-200">
      {/* Left: Coin Image & Name */}
      <div className="flex items-center gap-4 min-w-[180px]">
        <img
          src={token._id.image}
          alt={token._id.symbol}
          className="w-16 h-16 rounded-full object-cover border border-gray-300"
        />
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {token._id.name}
          </h3>
          <p className="text-sm text-gray-500">
            {token._id.symbol.toUpperCase()}
          </p>
        </div>
      </div>

      {/* Price Section */}
      <div className="flex flex-col items-center min-w-[120px]">
        <p className="text-lg font-semibold text-gray-900">
          ${token._id.price.toFixed(2)}
        </p>
        <p className="text-gray-500 text-sm">Price</p>
      </div>

      {/* Amount Section */}
      <div className="flex flex-col items-center min-w-[140px]">
        {isEditing ? (
          <input
            type="number"
            value={newAmount}
            onChange={(e) => setNewAmount(Number(e.target.value))}
            className="w-20 px-2 py-1 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
          />
        ) : (
          <p className="text-lg font-semibold text-gray-900">
            {token.amount.toLocaleString()} {token._id.symbol.toUpperCase()}
          </p>
        )}
        <p className="text-gray-500 text-sm">Amount</p>
      </div>

      {/* Total Value Section */}
      <div className="flex flex-col items-center min-w-[140px]">
        <p className="text-lg font-semibold text-green-600">
          ${(token.amount * token._id.price).toFixed(2)}
        </p>
        <p className="text-gray-500 text-sm">Value</p>
      </div>

      {/* Buttons Section */}
      <div className="flex flex-col gap-2 min-w-[100px]">
        {isEditing ? (
          <button
            onClick={() => {
              onUpdateAmount(token._id._id, newAmount);
              setIsEditing(false);
            }}
            className="px-4 py-1 text-sm font-semibold text-white bg-green-500 rounded-md hover:bg-green-600 transition-all"
          >
            Save
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-1 text-sm font-semibold text-blue-500 border border-blue-500 rounded-md hover:bg-blue-500 hover:text-white transition-all hover:scale-105"
          >
            Edit
          </button>
        )}

        <button
          onClick={() => onDelete(token._id._id)}
          className="px-4 py-1 text-sm font-semibold text-white bg-red-500 rounded-md hover:bg-red-600 transition-all hover:scale-105"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default Token;
