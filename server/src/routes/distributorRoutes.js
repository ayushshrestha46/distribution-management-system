import express from "express";
import DistributorController from "../controllers/distributorController.js";
import { isAuthenticated, authorizeRoles } from "../middlewares/auth.js";

const distributorRouter = express.Router();

distributorRouter.get("/", DistributorController.fetchAllDistributors);

distributorRouter.get(
  "/distributor-profile",
  isAuthenticated,
  authorizeRoles("distributor"),
  DistributorController.getDistributorProfile
);
distributorRouter.get(
  "/retailers",
  isAuthenticated,
  authorizeRoles("distributor"),
  DistributorController.getDistributorCustomers
);

distributorRouter.get(
  "/dashboard-data",
  isAuthenticated,
  authorizeRoles("distributor"),
  DistributorController.getDashboardData
);

distributorRouter.get('/view-payments', isAuthenticated, authorizeRoles('distributor'), DistributorController.viewPayments); // This is added 
distributorRouter.get("/:id", DistributorController.fetchSingleDistributor);

distributorRouter.post(
  "/add-distributor",
  isAuthenticated,
  authorizeRoles("admin"),
  DistributorController.addDistributor
);

distributorRouter.put(
  "/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  DistributorController.updateDistributor
);

export default distributorRouter;
