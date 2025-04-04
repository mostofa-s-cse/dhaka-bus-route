"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOtpExpiry = exports.generateOtp = void 0;
const generateOtp = () => {
    // Generate a 6-digit OTP
    return Math.floor(100000 + Math.random() * 900000).toString();
};
exports.generateOtp = generateOtp;
const generateOtpExpiry = () => {
    // Set OTP expiry time to 3 minutes from now
    return new Date(Date.now() + 3 * 60 * 1000); // 3 minutes
};
exports.generateOtpExpiry = generateOtpExpiry;
