import express from "express";
import DistributorController from "../controllers/distributorController.js";
import { isAuthenticated, authorizeRoles } from "../middlewares/auth.js";

const distributorRouter = express.Router();

distributorRouter.post(
  "/add-distributor",
  isAuthenticated,
  authorizeRoles("admin"),
  DistributorController.addDistributor
);
distributorRouter.get("/", DistributorController.fetchAllDistributors);
distributorRouter.put("/:id", DistributorController.fetchSingleDistributor);

export default distributorRouter;
