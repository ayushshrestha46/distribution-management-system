import express from "express";
import AdminController from "../controllers/adminController.js";
import { isAuthenticated, authorizeRoles } from "../middlewares/auth.js";

const adminRouter = express.Router();

// ************************* AUTHENTICATION ROUTES **********************

adminRouter.put(
  "/allocate-distributor",
  isAuthenticated,
  authorizeRoles("admin"),
  AdminController.allocateDistributor
);
adminRouter.get(
  "/allocation-request",
  isAuthenticated,
  authorizeRoles("admin"),
  AdminController.fetchDistributorAllocationRequest
);

adminRouter.get(
  "/all-orders",
  isAuthenticated,
  authorizeRoles("admin"),
  AdminController.fetchAllOrders
);
adminRouter.get(
  "/all-products",
  isAuthenticated,
  authorizeRoles("admin"),
  AdminController.fetchAllProducts
);
adminRouter.get(
  "/admin-dashboard",
  isAuthenticated,
  authorizeRoles("admin"),
  AdminController.adminDashboard
);
adminRouter.get(
  "/all-customers",
  isAuthenticated,
  authorizeRoles("admin"),
  AdminController.fetchAllCustomers
);

adminRouter.post(
  "/add-customer",
  isAuthenticated,
  authorizeRoles("admin"),
  AdminController.addUserByAdmin
);

adminRouter.put(
  "/update/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  AdminController.editUserByAdmin
);

adminRouter.put(
  "/ban/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  AdminController.banUserByAdmin
);

export default adminRouter;
