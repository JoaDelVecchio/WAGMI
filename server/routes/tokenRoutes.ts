import express from "express";

import { addToken, deleteToken } from "../controllers/tokenController";
import verifyToken from "../middleware/verifyToken";

const router = express.Router();

router.post("/:portfolioId", verifyToken, addToken);
router.delete("/:portfolioId/:tokenId", verifyToken, deleteToken);

export default router;
