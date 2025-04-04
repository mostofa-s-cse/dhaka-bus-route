"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.AppError = void 0;
const logger_1 = __importDefault(require("../utils/logger"));
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}
exports.AppError = AppError;
const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    // Log the error using logger
    logger_1.default.error({
        message: err.message,
        stack: err.stack,
        status: statusCode,
        url: req.originalUrl,
    });
    res.status(statusCode).json({
        error: true,
        message,
    });
};
exports.errorHandler = errorHandler;
