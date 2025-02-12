import express from "express";
import {
  getPortfolio,
  addToken,
  deleteToken,
  createPortfolio,
} from "../controllers/portfolioController";

const router = express.Router();

router.get("/:portfolioId", getPortfolio);
router.post("/", createPortfolio);
router.post("/:portfolioId", addToken);
router.delete("/:portfolioId/:tokenId", deleteToken);

export default router;
