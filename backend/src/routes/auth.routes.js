import express from "express";
import {
  loginUser,
  logoutUser,
  profile,
  registerUser,
} from "../controllers/auth.controllers.js";
import { authMiddleware } from "../middlewares/auth.middlewares.js";

const authRoutes = express.Router();

authRoutes.post("/register", registerUser);

authRoutes.post("/login", loginUser);

authRoutes.post("/logout", authMiddleware, logoutUser);

authRoutes.get("/profile", authMiddleware, profile);

export default authRoutes;
