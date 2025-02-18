import express from "express";
import DistributorController from "../controllers/distributorController.js";
import { isAuthenticated, authorizeRoles } from "../middlewares/auth.js";

const journalRouter = express.Router();

// distributorRouter.post("/add-distributor", isAuthenticated, authorizeRoles('admin'), DistributorController.addDistributor);
journalRouter.get("/", (req,res) =>{
    res.json({
        message:"I am here"
    })
})


export default journalRouter;

