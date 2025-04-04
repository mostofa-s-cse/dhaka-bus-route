"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
// Configure storage for Multer
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => __awaiter(void 0, void 0, void 0, function* () {
        const dir = "./uploads"; // Directory to save uploaded files
        try {
            // Check if the directory exists
            yield fs_1.promises.access(dir);
        }
        catch (err) {
            // Create directory if it doesn't exist
            yield fs_1.promises.mkdir(dir, { recursive: true });
        }
        cb(null, dir);
    }),
    filename: (req, file, cb) => {
        // Generate a unique filename
        const fileExtension = path_1.default.extname(file.originalname);
        const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}${fileExtension}`;
        cb(null, filename);
    },
});
// Initialize Multer
exports.upload = (0, multer_1.default)({ storage });
