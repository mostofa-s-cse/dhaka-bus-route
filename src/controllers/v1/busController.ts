import { NextFunction, Request, Response } from "express";
import * as busService from "../../services/v1/busSerivce";

/**
 * Get all bus companies.
 */
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

/**
 * Get all bus routes.
 */
export const getAllRoutes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const routes = await busService.getAllRoutes();
    res.status(200).json({
      success: true,
      data: routes,
      message: "Routes retrieved successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get route details with all points.
 */
export const getRouteDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const routeDetails = await busService.getRouteDetails(id);
    res.status(200).json({
      success: true,
      data: routeDetails,
      message: "Route details retrieved successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Find routes between two points.
 */
export const findRoutesBetweenPoints = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { from, to } = req.query;

    if (!from || !to) {
      throw new Error('Both "from" and "to" parameters are required');
    }

    const routes = await busService.findRoutesBetweenPoints(
      from as string,
      to as string
    );
    res.status(200).json({
      success: true,
      data: routes,
      message: "Routes found successfully",
    });
  } catch (error) {
    next(error);
  }
};
