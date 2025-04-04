"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../utils/logger"));
const errorLogger = (err, req, res, next) => {
    logger_1.default.error({
        message: err.message,
        stack: err.stack,
        status: err.statusCode || 500,
        url: req.originalUrl,
        method: req.method,
        body: req.body,
    });
    next(err); // Pass the error to the next middleware (e.g., errorHandler)
};
exports.default = errorLogger;
