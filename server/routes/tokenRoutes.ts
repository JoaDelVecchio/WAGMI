import express from "express";
import {
  addToken,
  deleteToken,
  updateTokenAmount,
} from "../controllers/tokenController";
import verifyToken from "../middleware/verifyToken";

const router = express.Router();

// 🟢 Add Token to Portfolio
router.post("/:portfolioId", verifyToken, addToken);

// 🗑️ Delete Token
router.delete("/:portfolioId/:tokenId", verifyToken, deleteToken);

// ✏️ Update Token Amount
router.put("/:portfolioId/:tokenId", verifyToken, updateTokenAmount);

export default router;
