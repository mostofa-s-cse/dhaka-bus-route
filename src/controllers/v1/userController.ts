import { Request, Response } from "express";
import * as userService from "../../services/v1/userService";
import { asyncHandler, sendResponse } from "../../utils/responseHandler";


/**
 * Get all users.
 */
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
    const users = await userService.getAllUsers();
    sendResponse(res, 200, users, "Data retrieved successfully");
});

/**
 * Update user.
 */
export const updateUser = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, email } = req.body;
    const profileImage = req.file ? `/uploads/${req.file.filename}` : undefined;

    const updatedUser = await userService.updateUser(id, { name, email, profileImage });
    sendResponse(res, 200, updatedUser, "User updated successfully");
});

/**
 * Delete user.
 */
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
    await userService.deleteUser(req.params.id);
    sendResponse(res, 200, null, "User deleted successfully");
});
