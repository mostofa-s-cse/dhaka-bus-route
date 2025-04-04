"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cluster_1 = __importDefault(require("cluster"));
const os_1 = __importDefault(require("os"));
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
dotenv_1.default.config();
const PORT = process.env.PORT || 4000;
const SERVER_URL = process.env.SERVER_URL || "http://localhost";
// Check if the current process is the master process
if (cluster_1.default.isPrimary) {
    console.log(`Master process ${process.pid} is running`);
    // Get the number of available CPU cores
    const numCPUs = os_1.default.cpus().length;
    // Fork workers for each CPU core
    for (let i = 0; i < numCPUs; i++) {
        cluster_1.default.fork();
    }
    // Listen for exit events to restart a worker if it dies
    cluster_1.default.on("exit", (worker, code, signal) => {
        console.error(`Worker ${worker.process.pid} died. Starting a new one...`);
        cluster_1.default.fork();
    });
}
else {
    // Workers can share the same port
    app_1.default.listen(PORT, () => {
        console.log(`Worker ${process.pid} started at ${SERVER_URL}:${PORT}`);
    });
}
