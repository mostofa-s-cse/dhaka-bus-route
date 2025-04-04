"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.requestPasswordReset = exports.refresh = exports.login = exports.resendOtp = exports.verify = exports.register = void 0;
const authService = __importStar(require("../../services/v1/authService"));
const errorHandler_1 = require("../../middlewares/errorHandler");
/**
 * Registers a new user.
 * - Accepts `email`, `password`, and `name` in the request body.
 * - Calls the authService to create a new user and sends an OTP to the user's email.
 * - Returns a success message upon successful registration.
 */
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, name } = req.body;
        const result = yield authService.registerUser(email, password, name);
        res.status(201).json({
            success: true,
            data: result
        });
    }
    catch (error) {
        next(error);
    }
});
exports.register = register;
/**
 * Verifies the OTP sent to the user's email during registration.
 * - Accepts `email` and `otp` in the request body.
 * - Verifies the OTP and updates the user's email verification status.
 * - Returns a success message if the OTP is valid.
 */
const verify = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, otp } = req.body;
        const result = yield authService.verifyOtp(email, otp);
        res.status(200).json({
            success: true,
            data: result
        });
    }
    catch (error) {
        next(error);
    }
});
exports.verify = verify;
/**
 * Resends a One-Time Password (OTP) to the user's email.
 * - Accepts `email` in the request body.
 * - Calls the authService to generate and send a new OTP to the provided email.
 * - Returns a success message if the OTP is successfully sent.
 * - Passes any encountered errors to the error-handling middleware.
 */
const resendOtp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const result = yield authService.resendOtp(email);
        res.status(200).json({
            success: true,
            data: result
        });
    }
    catch (error) {
        next(error);
    }
});
exports.resendOtp = resendOtp;
/**
 * Logs in the user.
 * - Accepts `email` and `password` in the request body.
 * - Authenticates the user, generates an access token and refresh token.
 * - Returns the tokens if authentication is successful.
 */
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const result = yield authService.loginUser(email, password);
        res.status(200).json({
            success: true,
            message: "Login successful. Welcome back!",
            data: result
        });
    }
    catch (error) {
        next(error);
    }
});
exports.login = login;
/**
 * Refresh the access token using the refresh token.
 * - Verifies the refresh token and generates new access and refresh tokens.
 * - Returns the new tokens if successful.
 */
const refresh = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return next(new errorHandler_1.AppError("Refresh token is required", 400));
    }
    try {
        const result = yield authService.refreshTokens(refreshToken);
        res.status(200).json({
            success: true,
            data: result
        });
    }
    catch (error) {
        next(error);
    }
});
exports.refresh = refresh;
/**
 * Requests a password reset.
 * - Accepts `email` in the request body.
 * - Calls the authService to generate a reset token and sends it to the user's email.
 * - Returns a success message upon successful request.
 */
const requestPasswordReset = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        // Call the service to handle the password reset request
        const result = yield authService.requestPasswordReset(email);
        res.status(200).json({
            success: true,
            message: result, // result is the success message returned from service
        });
    }
    catch (error) {
        next(error); // Pass the error to the error handler middleware
    }
});
exports.requestPasswordReset = requestPasswordReset;
/**
 * Resets the password using the provided OTP.
 * - Accepts `email`, `otp`, and `newPassword` in the request body.
 * - Calls the authService to reset the user's password.
 * - Returns a success message upon successful reset.
 */
const resetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, otp, newPassword } = req.body;
        // Call the service to handle the password reset
        const result = yield authService.resetPassword(email, otp, newPassword);
        res.status(200).json({
            success: true,
            message: result, // result is the success message returned from service
        });
    }
    catch (error) {
        next(error); // Pass the error to the error handler middleware
    }
});
exports.resetPassword = resetPassword;
