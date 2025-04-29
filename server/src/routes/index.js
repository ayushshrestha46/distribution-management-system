import express from "express";
import userRouter from "./userRoutes.js";
import distributorRouter from "./distributorRoutes.js";
import productRouter from "./productRoutes.js";
import adminRouter from "./adminRoutes.js";
import orderRouter from "./orderRoutes.js";

const router = express.Router();

router.use("/api/v1/user", userRouter);
router.use("/api/v1/distributor", distributorRouter);
router.use("/api/v1/product", productRouter);
router.use("/api/v1/order", orderRouter);
router.use("/api/v1/admin", adminRouter)

export default router;
