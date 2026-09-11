import AppError from "../errors/AppError.js";

export const createValidationError = (
  issues: {
    path: PropertyKey[];
    message: string;
  }[],
) => {
  const errors: { field: string; message: string }[] = [];

  issues.forEach((issue) => {
    errors.push({
      field: issue.path.length > 0
        ? String(issue.path[0])
        : "general",
      message: issue.message,
    });
  });

  return new AppError(
    "Error de validación",
    400,
    errors,
  );
};