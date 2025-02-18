import express from "express";
import AdminController from "../controllers/adminController.js";
import { isAuthenticated, authorizeRoles } from "../middlewares/auth.js";

const adminRouter = express.Router();


// ************************* AUTHENTICATION ROUTES **********************

// adminRouter.post("/register-distributor", AdminController.Registration);


export default adminRouter;
