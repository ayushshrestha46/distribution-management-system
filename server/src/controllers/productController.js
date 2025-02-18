import { asyncHandler } from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";
import ErrorHandler from "../utils/ErrorHandler.js";

class ProductController {
  static createProduct = asyncHandler(async (req, res, next) => {
    try {
      const { name, description, price, images, category } = req.body;
      // REVIEW: Make some changes on the basis of the models as well
      const product = await Product.findOne({ name: name });
      if (product) {
        return next(new ErrorHandler("Product name already exists", 400));
      }
      if (!images) {
        return next(new ErrorHandler("Atleast one image is required", 400));
      }
      // Now uploading the images to the cloudinary
      const imagesLinks = [];
      for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
          folder: "posts",
          quality: "auto:best",
          height: 600,
        });

        imagesLinks.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
      const newProduct = await Product.create({
        name,
        description,
        owner: req.user._id,
        price,
        category,
      });
      return res.status(200).json({
        success: true,
        message: "Product added Successfully",
        newProduct,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });

  static fetchAllProducts = asyncHandler(async (req, res, next) => {
    try {
      const products = await Product.find();
      if (!products) {
        return res.status(200).json({
          success: false,
          message: "No Products found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Products fetched successfully",
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });

  static fetchSingleProduct = asyncHandler(async (req, res, next) => {
    try {
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });

  static updateProductDetails = asyncHandler(async (req, res, next) => {
    try {
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });

  static updateProductStock = asyncHandler(async (req, res, next) => {
    try {
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });
  static deleteProduct = asyncHandler(async (req, res, next) => {
    try {
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });
}
export default ProductController;
