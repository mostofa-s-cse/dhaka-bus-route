import prisma from "../../config/database";
import { AppError } from "../../middlewares/errorHandler";

/**
 * Get all bus companies.
 * @returns A list of bus companies.
 */
export const getAllCompanies = async () => {
  return await prisma.busCompany.findMany();
};

/**
 * Get all bus routes.
 * @returns A list of bus routes with company names.
 */
export const getAllRoutes = async () => {
  return await prisma.busRoute.findMany({
    include: {
      company: {
        select: {
          name: true,
        },
      },
      routePoints: {
        orderBy: {
          sequenceNumber: "asc",
        },
      },
    },
  });
};

/**
 * Get route details with all points.
 * @param id Route ID.
 * @returns Route details with points.
 */
export const getRouteDetails = async (id: string) => {
  const route = await prisma.busRoute.findUnique({
    where: { id: parseInt(id) },
    include: {
      company: {
        select: {
          name: true,
        },
      },
      routePoints: {
        orderBy: {
          sequenceNumber: "asc",
        },
      },
    },
  });

  if (!route) throw new AppError("Route not found", 404);
  return route;
};

/**
 * Find routes between two points.
 * @param from Starting point.
 * @param to Destination point.
 * @returns List of routes between the two points.
 */
export const findRoutesBetweenPoints = async (from: string, to: string) => {
  return await prisma.busRoute.findMany({
    where: {
      routePoints: {
        some: {
          pointName: {
            contains: from,
            mode: "insensitive",
          },
        },
      },
      AND: {
        routePoints: {
          some: {
            pointName: {
              contains: to,
              mode: "insensitive",
            },
          },
        },
      },
    },
    include: {
      company: {
        select: {
          name: true,
        },
      },
    },
  });
};
