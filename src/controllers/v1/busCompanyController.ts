import { NextFunction, Request, Response } from "express";
import * as busService from "../../services/v1/busCompanyService";

export const getAllCompanies = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const companies = await busService.getAllCompanies();
    res.status(200).json({
      success: true,
      data: companies,
      message: "Companies retrieved successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const createCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      name,
      contact,
      address,
      website,
      phone,
      email,
      logo,
      isActive,
      description,
    } = req.body;
    const newCompany = await busService.createCompany({
      name,
      contact,
      address,
      website,
      phone,
      email,
      logo,
      isActive,
      description,
    });
    res.status(201).json({
      success: true,
      data: newCompany,
      message: "Company created successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updateCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const {
      name,
      contact,
      address,
      website,
      phone,
      email,
      logo,
      isActive,
      description,
    } = req.body;
    const updatedCompany = await busService.updateCompany(parseInt(id), {
      name,
      contact,
      address,
      website,
      phone,
      email,
      logo,
      isActive,
      description,
    });
    res.status(200).json({
      success: true,
      data: updatedCompany,
      message: "Company updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await busService.deleteCompany(parseInt(req.params.id));
    res.status(200).json({
      success: true,
      data: null,
      message: "Company deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
