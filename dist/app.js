"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const errorHandler_1 = require("./middlewares/errorHandler");
const errorLogger_1 = __importDefault(require("./middlewares/errorLogger"));
// Create Express app
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
// Define static folder for serving uploaded files (e.g., images)
app.use("/uploads", express_1.default.static("uploads"));
// Define a root route
app.get("/", (req, res) => {
    res.send(`Welcome to the Node.js MVC Server! PID: ${process.pid}`);
});
// Versioned routes
app.use("/api/v1", routes_1.default);
// Error logging middleware
app.use(errorLogger_1.default);
// General error handler middleware
app.use(errorHandler_1.errorHandler);
exports.default = app;
