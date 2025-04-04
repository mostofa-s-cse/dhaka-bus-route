import { Router } from "express";
import * as authController from "../../controllers/v1/authController";
import { isAuthenticated } from "../../middlewares/authMiddleware";

const authRouter = Router();

// Authentication routes
authRouter.post("/register", authController.register);      // Register
authRouter.post("/verify", authController.verify);          // Verify OTP
authRouter.post("/resend-otp", authController.resendOtp);   // Resend OTP
authRouter.post("/login", authController.login);            // Login
authRouter.post("/refresh", authController.refresh);        // Refresh Token
authRouter.get("/me", isAuthenticated, authController.me); // Get current user
authRouter.post("/logout", isAuthenticated, authController.logout); // Use POST for logout
// Password reset routes
authRouter.post("/request-password-reset", authController.requestPasswordReset);
authRouter.post("/reset-password", authController.resetPassword);

export default authRouter;
