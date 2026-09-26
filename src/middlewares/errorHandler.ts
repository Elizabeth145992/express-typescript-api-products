import express from "express";
import AppError from "../errors/AppError.js";
import { isMysqlError } from "../errors/mysql-error.js";
import DataBaseErrorMapper from "../errors/database-error.mapper.js";

const errorHandler = (
  error: Error,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  console.error(error);
  
  if (isMysqlError(error)) {
    const mapper = new DataBaseErrorMapper();
    const appError = mapper.toAppError(error);

    return res.status(appError.statusCode).json({
      message: appError.message,
    });
  } 
  
    if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
      details: error.details,
    });
  }

  res.status(500).json({
    message: "Internal Server Error",
  });
};

export default errorHandler;