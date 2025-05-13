import { ApiError } from "../utils/api-error.js";

export const errorHandler = (err, req, res, next) => {
  // If it's an instance of ApiError, format it properly
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json(err.toJSON());
  }

  // Fallback for unhandled errors
  console.error("Unhandled error:", err);

  return res.status(500).json({
    statusCode: 500,
    message: "Internal Server Error",
    errors: [err.message],
    success: false,
  });
};
