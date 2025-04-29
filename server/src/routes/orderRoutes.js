import express from "express";
import OrderController from "../controllers/orderController.js";
import { isAuthenticated, authorizeRoles } from "../middlewares/auth.js";

const orderRouter = express.Router();

orderRouter.post("/", isAuthenticated, OrderController.createOrder);

// **************** GET ALL ORDERS FOR THE USERS ***********************

orderRouter.get(
  "/get-orders/distributor",
  isAuthenticated,
  authorizeRoles("distributor"),
  OrderController.getDistributorsOrders
);

orderRouter.get(
  "/get-orders/shop",
  isAuthenticated,
  authorizeRoles("shop"),
  OrderController.getShopOrders
);
orderRouter.get(
  "/generateBill/:id",
  isAuthenticated,
  authorizeRoles("shop"),
  OrderController.generateBill
);

// ************ DISTRIBUTORS CONTROLS OVER THE ORDER *********************

orderRouter.put(
  "/accept-order/:id",
  isAuthenticated,
  authorizeRoles("distributor"),
  OrderController.acceptOrder
);

orderRouter.put(
  "/reject-order/:id",
  isAuthenticated,
  authorizeRoles("distributor"),
  OrderController.rejectOrder
);

orderRouter.put(
  "/delivered-order/:id",
  isAuthenticated,
  authorizeRoles("distributor"),
  OrderController.makeOrderAsDelivered
);

orderRouter.put(
  "/cash-payment/:id",
  isAuthenticated,
  authorizeRoles("distributor"),
  OrderController.markPaymentAsPaid
);

orderRouter.post(
  "/initiate-payment",
  isAuthenticated,
  authorizeRoles("shop"),
  OrderController.initiatePayment
);
orderRouter.put(
  "/complete-payment",
  isAuthenticated,
  authorizeRoles("shop"),
  OrderController.completePayment
);

export default orderRouter;
