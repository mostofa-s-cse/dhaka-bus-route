import { Request, Response, NextFunction } from "express";

/**
 * Generic async handler to reduce code duplication.
 */
export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => 
    (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };

/**
 * Response helper to standardize API responses.
 */
export const sendResponse = (res: Response, statusCode: number, data: any, message?: string) => {
    res.status(statusCode).json({ success: true, message, data });
};
