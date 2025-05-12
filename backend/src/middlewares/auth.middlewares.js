import jwt from "jsonwebtoken";
import { db } from "../utils/db.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";

export const authMiddleware = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.jwt;

  if (!token) {
    throw new ApiError(401, "Unauthorized - No token provided");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new ApiError(401, "Unauthorized - Invalid or expired token");
  }

  const user = await db.user.findUnique({
    where: { id: decoded.id },
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      role: true,
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  req.user = user;
  next();
});

export const checkAdmin = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      role: true,
    },
  });

  if (!user || user.role !== "ADMIN") {
    return res
      .status(403)
      .json(new ApiError(403, "Access denied - Admins only"));
  }
  next();
});
