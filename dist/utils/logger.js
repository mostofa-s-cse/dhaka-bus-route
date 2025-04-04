"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const logger = (0, winston_1.createLogger)({
    level: "error", // Only log errors
    format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.json() // Log messages in JSON format
    ),
    transports: [
        new winston_1.transports.Console(), // Log to console
        new winston_1.transports.File({ filename: "error.log" }) // Log to a file
    ],
});
exports.default = logger;
