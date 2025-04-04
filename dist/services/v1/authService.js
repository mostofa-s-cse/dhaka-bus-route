"use strict";
// src/services/userService.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.requestPasswordReset = exports.refreshTokens = exports.loginUser = exports.resendOtp = exports.verifyOtp = exports.registerUser = void 0;
const errorHandler_1 = require("../../middlewares/errorHandler");
const database_1 = __importDefault(require("../../config/database"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const email_1 = require("../../utils/email");
const emailValidation_1 = require("../../utils/emailValidation"); // Import validateEmail function
const generateOtp_1 = require("../../utils/generateOtp"); // Import OTP utility functions
/**
 * Register a new user.
 * - Hashes the password.
 * - Saves the user to the database.
 * - Sends an OTP for email verification.
 */
const registerUser = (email, password, name) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate email format before processing
    (0, emailValidation_1.validateEmail)(email);
    const existingUser = yield database_1.default.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new errorHandler_1.AppError("User already exists", 400);
    }
    const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
    const user = yield database_1.default.user.create({
        data: { email, password: hashedPassword, name },
    });
    const otp = (0, generateOtp_1.generateOtp)(); // Generate OTP using utility
    yield (0, email_1.sendEmail)(email, "Verify Your Email", name, otp); // Send OTP email
    yield database_1.default.user.update({ where: { id: user.id }, data: { otp } });
    return { message: "User registered successfully. Please verify your email." };
});
exports.registerUser = registerUser;
/**
 * Verify the user's email using OTP.
 * - Checks if the OTP matches.
 * - Marks the email as verified.
 */
const verifyOtp = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate email format before processing
    (0, emailValidation_1.validateEmail)(email);
    const user = yield database_1.default.user.findUnique({ where: { email } });
    if (!user) {
        throw new errorHandler_1.AppError("User not found", 404);
    }
    if (user.otp !== otp) {
        throw new errorHandler_1.AppError("Invalid OTP", 400);
    }
    yield database_1.default.user.update({
        where: { email },
        data: { emailVerified: true, otp: null },
    });
    return { message: "Email verified successfully." };
});
exports.verifyOtp = verifyOtp;
/**
 * Resend OTP for email verification.
 * - Generates a new OTP and sends it via email.
 */
const resendOtp = (email) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate email format before processing
    (0, emailValidation_1.validateEmail)(email);
    const user = yield database_1.default.user.findUnique({ where: { email } });
    if (!user) {
        throw new errorHandler_1.AppError("User not found", 404);
    }
    if (user.emailVerified) {
        throw new errorHandler_1.AppError("Email is already verified", 400);
    }
    if (!user.name) {
        throw new errorHandler_1.AppError("User name is missing", 400);
    }
    const otp = (0, generateOtp_1.generateOtp)(); // Generate new OTP using utility
    yield (0, email_1.sendEmail)(email, "Verify Your Email", user.name, otp);
    yield database_1.default.user.update({ where: { email }, data: { otp } });
    return { message: "OTP sent successfully. Please check your email." };
});
exports.resendOtp = resendOtp;
/**
 * Login a user.
 * - Verifies credentials.
 * - Generates access and refresh tokens.
 */
const loginUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate email format before processing
    (0, emailValidation_1.validateEmail)(email);
    const user = yield database_1.default.user.findUnique({ where: { email } });
    if (!user) {
        throw new errorHandler_1.AppError("Invalid email or password", 401);
    }
    if (!user.emailVerified) {
        throw new errorHandler_1.AppError("Email not verified", 403);
    }
    const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        throw new errorHandler_1.AppError("Invalid email or password", 401);
    }
    const accessToken = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "60m" });
    const refreshToken = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
    yield database_1.default.user.update({ where: { id: user.id }, data: { refreshToken } });
    return { user, accessToken, refreshToken };
});
exports.loginUser = loginUser;
/**
 * Refresh the access token.
 * - Verifies the refresh token.
 * - Generates a new access token and refresh token if valid.
 * - Returns the new tokens.
 */
const refreshTokens = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const userId = decoded.id;
    // Retrieve the user from the database
    const user = yield database_1.default.user.findUnique({ where: { id: userId } });
    if (!user || user.refreshToken !== refreshToken) {
        throw new errorHandler_1.AppError("Invalid refresh token", 401);
    }
    // Generate new access and refresh tokens
    const accessToken = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "15m" });
    const newRefreshToken = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
    // Update the refresh token in the database
    yield database_1.default.user.update({
        where: { id: user.id },
        data: { refreshToken: newRefreshToken },
    });
    return { accessToken, refreshToken: newRefreshToken };
});
exports.refreshTokens = refreshTokens;
/**
 * Request a password reset.
 * @param email The user's email address.
 */
const requestPasswordReset = (email) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate email format before processing
    (0, emailValidation_1.validateEmail)(email);
    // Check if user exists
    const user = yield database_1.default.user.findUnique({ where: { email } });
    if (!user) {
        throw new errorHandler_1.AppError("User not found", 404);
    }
    // Generate a reset OTP (6 digits)
    const otp = (0, generateOtp_1.generateOtp)(); // Generate OTP using utility
    // Set OTP expiry time to 3 minutes from now
    const otpExpiry = (0, generateOtp_1.generateOtpExpiry)(); // Generate OTP expiry using utility
    // Save the OTP and its expiry to the user's record
    yield database_1.default.user.update({
        where: { email },
        data: {
            passwordResetToken: otp, // Store OTP as the reset token
            passwordResetTokenExpires: otpExpiry,
        },
    });
    // Send the OTP via email
    const emailMessage = `You requested a password reset. Use the following OTP to reset your password: ${otp}. It will expire in 3 minutes.`;
    yield (0, email_1.sendEmail)(email, "Password Reset OTP", user.name || "User", emailMessage);
    return "Password reset OTP has been sent to your email. Please check your inbox.";
});
exports.requestPasswordReset = requestPasswordReset;
/**
 * Reset the password using an OTP.
 * @param email The user's email address.
 * @param otp The OTP sent to the user's email.
 * @param newPassword The new password to set.
 */
const resetPassword = (email, otp, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if user exists
    const user = yield database_1.default.user.findUnique({ where: { email } });
    if (!user) {
        throw new errorHandler_1.AppError("User not found", 404);
    }
    // Check if the OTP matches
    if (user.passwordResetToken !== otp) {
        throw new errorHandler_1.AppError("Invalid OTP", 400);
    }
    // Check if OTP has expired (handle case where passwordResetTokenExpires might be null)
    if (!user.passwordResetTokenExpires || user.passwordResetTokenExpires < new Date()) {
        throw new errorHandler_1.AppError("OTP has expired", 400);
    }
    // Hash the new password
    const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 10);
    // Update the user's password and clear the OTP fields
    yield database_1.default.user.update({
        where: { email },
        data: {
            password: hashedPassword,
            passwordResetToken: null, // Clear OTP after successful reset
            passwordResetTokenExpires: null, // Clear OTP expiry
        },
    });
    return "Your password has been reset successfully.";
});
exports.resetPassword = resetPassword;
