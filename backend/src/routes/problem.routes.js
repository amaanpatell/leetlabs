import express from "express";
import { authMiddleware, checkAdmin } from "../middlewares/auth.middlewares.js";
import { createProblem, deleteProblem, getAllProblems, getAllProblemsSolvedByUser, getProblemsById, updateProblemById } from "../controllers/problem.controller.js";

const problemRoutes = express.Router();

problemRoutes.post("/create-problem", authMiddleware, checkAdmin, createProblem);

problemRoutes.get("/get-all-problems", authMiddleware, getAllProblems)

problemRoutes.get("/get-problem/:id", authMiddleware, getProblemsById)

problemRoutes.put("/update-problem/:id", authMiddleware, checkAdmin, updateProblemById)

problemRoutes.delete("/delete-problem/:id", authMiddleware, checkAdmin, deleteProblem)

problemRoutes.get("/get-solved-problems/:id", authMiddleware, checkAdmin, getAllProblemsSolvedByUser)

export default problemRoutes;
