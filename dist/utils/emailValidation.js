"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEmail = void 0;
const errorHandler_1 = require("../middlewares/errorHandler");
/**
 * Validates the format of an email address using a regular expression.
 * @param email - The email address to be validated
 * @throws AppError if the email is invalid
 */
const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
        throw new errorHandler_1.AppError("Invalid email format", 400);
    }
};
exports.validateEmail = validateEmail;
