import express from "express";
import {
  getPortfolio,
  createPortfolio,
} from "../controllers/portfolioController";
import verifyToken from "../middleware/verifyToken";

const router = express.Router();

router.get("/:portfolioId", verifyToken, getPortfolio);
router.post("/", verifyToken, createPortfolio);

export default router;
