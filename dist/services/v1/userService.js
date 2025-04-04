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
exports.deleteUser = exports.updateUser = exports.getAllUsers = void 0;
const errorHandler_1 = require("../../middlewares/errorHandler");
const database_1 = __importDefault(require("../../config/database"));
const emailValidation_1 = require("../../utils/emailValidation"); // Custom error handling
// Get all users
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield database_1.default.user.findMany({
        select: {
            id: true,
            email: true,
            name: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    return users;
});
exports.getAllUsers = getAllUsers;
// Update user
/**
 * Update the user profile.
 * @param id User ID to update.
 * @param data Object containing fields to update (name, email, image).
 * @returns Updated user data.
 */
const updateUser = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate email format if email is provided
    if (data.email) {
        (0, emailValidation_1.validateEmail)(data.email);
    }
    const existingUser = yield database_1.default.user.findUnique({ where: { id: parseInt(id) } });
    if (!existingUser) {
        throw new errorHandler_1.AppError("User not found", 404);
    }
    const updatedUser = yield database_1.default.user.update({
        where: { id: parseInt(id) },
        data,
        select: {
            id: true,
            email: true,
            name: true,
            profileImage: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    return updatedUser;
});
exports.updateUser = updateUser;
// Delete user
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield database_1.default.user.findUnique({ where: { id: parseInt(id) } });
    if (!existingUser) {
        throw new errorHandler_1.AppError("User not found", 404);
    }
    yield database_1.default.user.delete({ where: { id: parseInt(id) } });
});
exports.deleteUser = deleteUser;
