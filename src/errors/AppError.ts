class AppError extends Error {
  statusCode: number;
  details?: unknown;

  constructor(message: string, statusCode: number, datails?: unknown) {
    super(message);

    this.name = "AppError";
    this.statusCode = statusCode;
    this.details = datails;
  }
}

export default AppError;