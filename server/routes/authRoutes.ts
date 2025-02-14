import express from "express";
import {
  getAuthenticatedUser,
  login,
  logout,
  register,
} from "../controllers/authController";
import verifyToken from "../middleware/verifyToken";

const router = express.Router();

router.get("/me", verifyToken, getAuthenticatedUser);
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

export default router;
