import { Router } from "express";
import * as busCompanyController from "../../controllers/v1/busCompanyController";
import { checkPermission } from "../../middlewares/checkPermission";
import { isAuthenticated } from "../../middlewares/isAuthenticated";
import { upload } from "../../utils/fileUpload";

const busCompanyRouter = Router();

busCompanyRouter.post(
  "/",
  isAuthenticated,
  checkPermission("create-busCompany"),
  busCompanyController.createCompany
);
busCompanyRouter.get(
  "/",
  isAuthenticated,
  checkPermission("view-busCompany"),
  busCompanyController.getAllCompanies
); // Get all bus companies

busCompanyRouter.put(
  "/:id",
  isAuthenticated, // Middleware to ensure authentication
  upload.single("logo"),
  checkPermission("update-busCompany"),
  busCompanyController.updateCompany // Controller to handle update logic
);
busCompanyRouter.delete(
  "/:id",
  isAuthenticated,
  checkPermission("delete-busCompany"),
  busCompanyController.deleteCompany
); // Delete bus company
export default busCompanyRouter;
