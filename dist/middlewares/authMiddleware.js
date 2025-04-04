"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errorHandler_1 = require("./errorHandler"); // Import your AppError class
const isAuthenticated = (req, res, next) => {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1]; // Extract the token from Authorization header
        if (!token) {
            // Use AppError instead of throwing a generic error
            return next(new errorHandler_1.AppError("No token provided", 401)); // Pass the error to next()
        }
        // Verify the token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id; // Attach user ID to the request
        next(); // Call the next middleware or route handler
    }
    catch (error) {
        // Pass the error to the error handler middleware
        next(new errorHandler_1.AppError("Unauthorized", 401)); // Handle JWT verification failure
    }
};
exports.isAuthenticated = isAuthenticated;
