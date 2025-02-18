import express from "express";
import ProductController from "../controllers/productController.js";
import { isAuthenticated, authorizeRoles } from "../middlewares/auth.js";

const productRouter = express.Router();

productRouter.post(
  "/",
  isAuthenticated,
  authorizeRoles("admin"),
  ProductController.createProduct
);
productRouter.get(
  "/",
  isAuthenticated,
  authorizeRoles("admin"),
  ProductController.fetchAllProducts
);
productRouter.get(
  "/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  ProductController.fetchSingleProduct
);
productRouter.put(
  "/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  ProductController.updateProductDetails
);
productRouter.patch(
  "/:id",
  isAuthenticated,
  authorizeRoles,
  ProductController.updateProductStock
);

export default productRouter;
