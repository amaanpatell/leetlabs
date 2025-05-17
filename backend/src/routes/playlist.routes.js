import express from "express";
import { authMiddleware } from "../middlewares/auth.middlewares.js";

const playlistRoutes = express.Router();

playlistRoutes.get("/", authMiddleware, )

export default playlistRoutes;