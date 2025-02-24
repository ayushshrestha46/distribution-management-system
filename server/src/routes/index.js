import express from "express";
import userRouter from "./userRoutes.js";
import distributorRouter from "./distributorRoutes.js";
import productRouter from "./productRoutes.js";



const router = express.Router();

router.use("/api/v1/user", userRouter);
router.use("/api/v1/distributor", distributorRouter);
// router.use("/api/v1/journal", journalRoutes);
// router.use("/api/v1/admin", adminRouter);
router.use("/api/v1/product", productRouter);
// router.use("/api/v1/order", appointmentRouter);

export default router;
