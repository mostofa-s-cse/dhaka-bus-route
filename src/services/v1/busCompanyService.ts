import prisma from "../../config/database";
import { AppError } from "../../middlewares/errorHandler";

type CompanyCreateInput = {
  name: string;
  contact?: string;
  address?: string;
  website?: string;
  phone?: string;
  email?: string;
  logo?: string;
  isActive?: boolean;
  description?: string;
};

type CompanyUpdateInput = Partial<CompanyCreateInput>;

/**
 * Get all bus companies.
 * @returns A list of bus companies.
 */
export const getAllCompanies = async () => {
  return await prisma.busCompany.findMany();
};

/**
 * Create a new bus company.
 * @param data The company data to create.
 * @returns The created bus company.
 */
export const createCompany = async (data: CompanyCreateInput) => {
  console.log("Creating company with data:", data);
  return await prisma.busCompany.create({ data });
};

/**
 * Update an existing bus company.
 * @param id The ID of the company to update.
 * @param data The new data for the company.
 * @returns The updated bus company.
 */
export const updateCompany = async (id: number, data: CompanyUpdateInput) => {
  const existingCompany = await prisma.busCompany.findUnique({ where: { id } });
  if (!existingCompany) throw new AppError("Company not found", 404);
  return await prisma.busCompany.update({ where: { id }, data });
};

/**
 * Delete a bus company.
 * @param id The ID of the company to delete.
 * @returns A confirmation message upon successful deletion.
 */
export const deleteCompany = async (id: number) => {
  const existingCompany = await prisma.busCompany.findUnique({ where: { id } });
  if (!existingCompany) throw new AppError("Company not found", 404);
  await prisma.busCompany.delete({ where: { id } });
};
