import { AppError } from "../../middlewares/errorHandler";
import prisma from "../../config/database";
import { validateEmail } from "../../utils/emailValidation"; 

/**
 * Get all users.
 * @returns A list of users with selected fields.
 */
export const getAllUsers = async () => {
    return await prisma.user.findMany({
        select: {
            id: true,
            email: true,
            name: true,
            createdAt: true,
            updatedAt: true,
        },
    });
};

/**
 * Update the user profile.
 * @param id User ID to update.
 * @param data Object containing fields to update (name, email, profileImage).
 * @returns Updated user data.
 */
export const updateUser = async (id: string, data: { name?: string; email?: string; profileImage?: string }) => {
    // Validate email format if email is provided
    if (data.email) validateEmail(data.email);

    const existingUser = await prisma.user.findUnique({ where: { id: parseInt(id) } });
    if (!existingUser) throw new AppError("User not found", 404);

    return await prisma.user.update({
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
};

/**
 * Delete a user.
 * @param id User ID to delete.
 * @throws AppError if the user is not found.
 */
export const deleteUser = async (id: string) => {
    const existingUser = await prisma.user.findUnique({ where: { id: parseInt(id) } });
    if (!existingUser) throw new AppError("User not found", 404);

    await prisma.user.delete({ where: { id: parseInt(id) } });
};