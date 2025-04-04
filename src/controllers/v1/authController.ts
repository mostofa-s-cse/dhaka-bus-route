import { Request, Response, NextFunction } from "express";
import * as authService from "../../services/v1/authService";
import { AppError } from "../../middlewares/errorHandler";
import { asyncHandler, sendResponse } from "../../utils/responseHandler";

// Type extension
declare global {
    namespace Express {
        interface Request {
            user: { id: string; }
        }
    }
}

/**
 * Register a new user.
 * - Hashes the password.
 * - Saves the user to the database.
 * - Sends an OTP for email verification.
 */
export const register = asyncHandler(async (req: Request, res: Response) => {
    const { email, password, name } = req.body;
    const result = await authService.registerUser(email, password, name);
    sendResponse(res, 201, result);
});

/**
 * Verify the user's email using an OTP.
 * - Checks if the OTP is valid.
 * - Marks the email as verified.
 */
export const verify = asyncHandler(async (req: Request, res: Response) => {
    const { email, otp } = req.body;
    const result = await authService.verifyOtp(email, otp);
    sendResponse(res, 200, result);
});

/**
 * Resend OTP for email verification.
 * - Sends a new OTP to the user's email.
 */
export const resendOtp = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
    const result = await authService.resendOtp(email);
    sendResponse(res, 200, result);
});

/**
 * Log in a user.
 * - Validates email and password.
 * - Returns an access token and refresh token.
 */
export const login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    sendResponse(res, 200, result, "Login successful. Welcome back!");
});

/**
 * Refresh access token using a refresh token.
 * - Validates the refresh token.
 * - Issues a new access token and refresh token.
 */
export const refresh = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        throw new AppError("Refresh token is required", 400);
    }
    const result = await authService.refreshTokens(refreshToken);
    sendResponse(res, 200, result);
});

/**
 * Request a password reset.
 * - Sends an OTP to reset the password.
 */
export const requestPasswordReset = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.requestPasswordReset(req.body.email);
    sendResponse(res, 200, { message: result });
});

/**
 * Reset password using an OTP.
 * - Validates OTP.
 * - Updates the password in the database.
 */
export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const { email, otp, newPassword } = req.body;
    const result = await authService.resetPassword(email, otp, newPassword);
    sendResponse(res, 200, { message: result });
});

/**
 * Logout a user.
 * - Clears the refresh token.
 */
export const logout = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    await authService.logout(refreshToken);
    sendResponse(res, 200, { message: "Logout successful." });
});

/**
 * Get current authenticated user details.
 * - Returns user information based on the authenticated user.
 */
export const me = asyncHandler(async (req: Request, res: Response) => {
    const user = await authService.getUserById(req.user.id);
    sendResponse(res, 200, { user });
});

