import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Skip validation if it's a FormData request with files
      if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        // For FormData requests, we'll handle validation in the controller
        next();
        return;
      }

      // For JSON requests, validate normally
      req.body = schema.parse(req.body);
      next();
    } catch (error: any) {
      return res.status(400).json({
        error: "Validation error",
        details: error.errors,
      });
    }
  };
};
