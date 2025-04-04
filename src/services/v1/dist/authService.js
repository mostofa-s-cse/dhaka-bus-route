"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.getUserById = exports.logout = exports.resetPassword = exports.requestPasswordReset = exports.refreshTokens = exports.loginUser = exports.resendOtp = exports.verifyOtp = exports.registerUser = void 0;
var errorHandler_1 = require("../../middlewares/errorHandler");
var database_1 = require("../../config/database");
var bcryptjs_1 = require("bcryptjs");
var jsonwebtoken_1 = require("jsonwebtoken");
var email_1 = require("../../utils/email");
var emailValidation_1 = require("../../utils/emailValidation");
var generateOtp_1 = require("../../utils/generateOtp");
/**
 * Register a new user.
 * - Hashes the password.
 * - Saves the user to the database.
 * - Sends an OTP for email verification.
 */
exports.registerUser = function (email, password, name) { return __awaiter(void 0, void 0, void 0, function () {
    var existingUser, hashedPassword, user, otp;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                emailValidation_1.validateEmail(email); // Validate email format before processing
                return [4 /*yield*/, database_1["default"].user.findUnique({ where: { email: email } })];
            case 1:
                existingUser = _a.sent();
                if (existingUser)
                    throw new errorHandler_1.AppError("User already exists", 400);
                return [4 /*yield*/, bcryptjs_1["default"].hash(password, 10)];
            case 2:
                hashedPassword = _a.sent();
                return [4 /*yield*/, database_1["default"].user.create({ data: { email: email, password: hashedPassword, name: name } })];
            case 3:
                user = _a.sent();
                otp = generateOtp_1.generateOtp();
                return [4 /*yield*/, email_1.sendEmail(email, "Verify Your Email", name, otp)];
            case 4:
                _a.sent(); // Send OTP email
                return [4 /*yield*/, database_1["default"].user.update({ where: { id: user.id }, data: { otp: otp } })];
            case 5:
                _a.sent();
                return [2 /*return*/, { message: "User registered successfully. Please verify your email." }];
        }
    });
}); };
/**
 * Verify the user's email using OTP.
 * - Checks if the OTP matches.
 * - Marks the email as verified.
 */
exports.verifyOtp = function (email, otp) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                emailValidation_1.validateEmail(email); // Validate email format before processing
                return [4 /*yield*/, database_1["default"].user.findUnique({ where: { email: email } })];
            case 1:
                user = _a.sent();
                if (!user)
                    throw new errorHandler_1.AppError("User not found", 404);
                if (user.otp !== otp)
                    throw new errorHandler_1.AppError("Invalid OTP", 400);
                return [4 /*yield*/, database_1["default"].user.update({ where: { email: email }, data: { emailVerified: true, otp: null } })];
            case 2:
                _a.sent();
                return [2 /*return*/, { message: "Email verified successfully." }];
        }
    });
}); };
/**
 * Resend OTP for email verification.
 * - Generates a new OTP and sends it via email.
 */
exports.resendOtp = function (email) { return __awaiter(void 0, void 0, void 0, function () {
    var user, otp;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                emailValidation_1.validateEmail(email); // Validate email format before processing
                return [4 /*yield*/, database_1["default"].user.findUnique({ where: { email: email } })];
            case 1:
                user = _a.sent();
                if (!user)
                    throw new errorHandler_1.AppError("User not found", 404);
                if (user.emailVerified)
                    throw new errorHandler_1.AppError("Email is already verified", 400);
                if (!user.name)
                    throw new errorHandler_1.AppError("User name is missing", 400);
                otp = generateOtp_1.generateOtp();
                return [4 /*yield*/, email_1.sendEmail(email, "Verify Your Email", user.name, otp)];
            case 2:
                _a.sent();
                return [4 /*yield*/, database_1["default"].user.update({ where: { email: email }, data: { otp: otp } })];
            case 3:
                _a.sent();
                return [2 /*return*/, { message: "OTP sent successfully. Please check your email." }];
        }
    });
}); };
/**
 * Login a user.
 * - Verifies credentials.
 * - Generates access and refresh tokens.
 */
exports.loginUser = function (email, password) { return __awaiter(void 0, void 0, void 0, function () {
    var user, isPasswordValid, accessToken, refreshToken;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                emailValidation_1.validateEmail(email); // Validate email format before processing
                return [4 /*yield*/, database_1["default"].user.findUnique({ where: { email: email } })];
            case 1:
                user = _a.sent();
                if (!user)
                    throw new errorHandler_1.AppError("Invalid email or password", 401);
                if (!user.emailVerified)
                    throw new errorHandler_1.AppError("Email not verified", 403);
                return [4 /*yield*/, bcryptjs_1["default"].compare(password, user.password)];
            case 2:
                isPasswordValid = _a.sent();
                if (!isPasswordValid)
                    throw new errorHandler_1.AppError("Invalid email or password", 401);
                accessToken = jsonwebtoken_1["default"].sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "60m" });
                refreshToken = jsonwebtoken_1["default"].sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
                return [4 /*yield*/, database_1["default"].user.update({ where: { id: user.id }, data: { refreshToken: refreshToken } })];
            case 3:
                _a.sent();
                return [2 /*return*/, { user: user, accessToken: accessToken, refreshToken: refreshToken }];
        }
    });
}); };
/**
 * Refresh the access token.
 * - Verifies the refresh token.
 * - Generates a new access token and refresh token if valid.
 * - Returns the new tokens.
 */
exports.refreshTokens = function (refreshToken) { return __awaiter(void 0, void 0, void 0, function () {
    var decoded, userId, user, accessToken, newRefreshToken;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                decoded = jsonwebtoken_1["default"].verify(refreshToken, process.env.JWT_REFRESH_SECRET);
                userId = decoded.id;
                return [4 /*yield*/, database_1["default"].user.findUnique({ where: { id: userId } })];
            case 1:
                user = _a.sent();
                if (!user || user.refreshToken !== refreshToken)
                    throw new errorHandler_1.AppError("Invalid refresh token", 401);
                accessToken = jsonwebtoken_1["default"].sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "15m" });
                newRefreshToken = jsonwebtoken_1["default"].sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
                return [4 /*yield*/, database_1["default"].user.update({ where: { id: user.id }, data: { refreshToken: newRefreshToken } })];
            case 2:
                _a.sent();
                return [2 /*return*/, { accessToken: accessToken, refreshToken: newRefreshToken }];
        }
    });
}); };
/**
 * Request a password reset.
 * @param email The user's email address.
 */
exports.requestPasswordReset = function (email) { return __awaiter(void 0, void 0, void 0, function () {
    var user, otp, otpExpiry, emailMessage;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                emailValidation_1.validateEmail(email); // Validate email format before processing
                return [4 /*yield*/, database_1["default"].user.findUnique({ where: { email: email } })];
            case 1:
                user = _a.sent();
                if (!user)
                    throw new errorHandler_1.AppError("User not found", 404);
                otp = generateOtp_1.generateOtp();
                otpExpiry = generateOtp_1.generateOtpExpiry();
                return [4 /*yield*/, database_1["default"].user.update({
                        where: { email: email },
                        data: { passwordResetToken: otp, passwordResetTokenExpires: otpExpiry }
                    })];
            case 2:
                _a.sent();
                emailMessage = "You requested a password reset. Use the following OTP to reset your password: " + otp + ". It will expire in 3 minutes.";
                return [4 /*yield*/, email_1.sendEmail(email, "Password Reset OTP", user.name || "User", emailMessage)];
            case 3:
                _a.sent();
                return [2 /*return*/, "Password reset OTP has been sent to your email. Please check your inbox."];
        }
    });
}); };
/**
 * Reset the password using an OTP.
 * @param email The user's email address.
 * @param otp The OTP sent to the user's email.
 * @param newPassword The new password to set.
 */
exports.resetPassword = function (email, otp, newPassword) { return __awaiter(void 0, void 0, void 0, function () {
    var user, hashedPassword;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, database_1["default"].user.findUnique({ where: { email: email } })];
            case 1:
                user = _a.sent();
                if (!user)
                    throw new errorHandler_1.AppError("User not found", 404);
                if (user.passwordResetToken !== otp)
                    throw new errorHandler_1.AppError("Invalid OTP", 400);
                if (!user.passwordResetTokenExpires || user.passwordResetTokenExpires < new Date())
                    throw new errorHandler_1.AppError("OTP has expired", 400);
                return [4 /*yield*/, bcryptjs_1["default"].hash(newPassword, 10)];
            case 2:
                hashedPassword = _a.sent();
                return [4 /*yield*/, database_1["default"].user.update({
                        where: { email: email },
                        data: { password: hashedPassword, passwordResetToken: null, passwordResetTokenExpires: null }
                    })];
            case 3:
                _a.sent();
                return [2 /*return*/, "Your password has been reset successfully."];
        }
    });
}); };
/**
 * Logout user by invalidating refresh token.
 * - Finds user by refresh token and clears it.
 */
exports.logout = function (refreshToken) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, database_1["default"].user.findFirst({
                    where: {
                        refreshToken: refreshToken
                    }
                })];
            case 1:
                user = _a.sent();
                if (!user) {
                    throw new errorHandler_1.AppError("Invalid refresh token", 404);
                }
                return [4 /*yield*/, database_1["default"].user.update({
                        where: { id: user.id },
                        data: { refreshToken: null }
                    })];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
/**
 * Get current user details.
 * - Returns user information excluding sensitive data.
 */
exports.getUserById = function (userId) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, database_1["default"].user.findUnique({
                    where: { id: parseInt(userId) },
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        emailVerified: true,
                        profileImage: true,
                        createdAt: true,
                        updatedAt: true
                    }
                })];
            case 1:
                user = _a.sent();
                if (!user)
                    throw new errorHandler_1.AppError("User not found", 404);
                return [2 /*return*/, user];
        }
    });
}); };
