import express, { urlencoded } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import problemRoutes from "./routes/problem.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import executionRoute from "./routes/executeCode.routes.js";

dotenv.config({
  path: "./.env",
});

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello Guys welcome to leetlab");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/problems", problemRoutes);
app.use("/api/v1/execute-code", executionRoute);
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});