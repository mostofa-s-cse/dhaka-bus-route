"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRoutes_1 = __importDefault(require("./v1/authRoutes"));
const userRoutes_1 = __importDefault(require("./v1/userRoutes"));
const router = (0, express_1.Router)();
// Version 1 routes
// Combine all routes
router.use("/auth", authRoutes_1.default); // Routes for authentication
router.use("/users", userRoutes_1.default); // Routes for user management
// Version 2 routes
exports.default = router;
