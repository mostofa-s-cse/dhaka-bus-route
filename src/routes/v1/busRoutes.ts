import { Router } from "express";
import * as busCompanyController from "../../controllers/v1/busCompanyController";
import { checkPermission } from "../../middlewares/checkPermission";
import { isAuthenticated } from "../../middlewares/isAuthenticated";

const busRouter = Router();

busRouter.post(
  "/",
  isAuthenticated,
  checkPermission("create-busCompany"),
  busCompanyController.createCompany
);
busRouter.get(
  "/",
  isAuthenticated,
  checkPermission("view-busCompany"),
  busCompanyController.getAllCompanies
); // Get all bus companies
busRouter.put(
  "/:id",
  isAuthenticated, // Middleware to ensure authentication
  checkPermission("update-busCompany"),
  busCompanyController.updateCompany // Controller to handle update logic
);
busRouter.delete(
  "/:id",
  isAuthenticated,
  checkPermission("delete-busCompany"),
  busCompanyController.deleteCompany
); // Delete bus company

export default busRouter;
