import express from "express";
import AppError from "../errors/AppError.js";

const errorHandler = (
  error: Error,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  console.error(error);

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
    });
  }

  res.status(500).json({
    message: "Internal Server Error",
  });
};

export default errorHandler;