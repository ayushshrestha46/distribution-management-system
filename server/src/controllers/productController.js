import { asyncHandler } from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import cloudinary from "cloudinary";
import Distributor from "../models/distributorModel.js";
import User from "../models/userModel.js";

class ProductController {
  static createProduct = asyncHandler(async (req, res, next) => {
    try {
      const { name, description, price, images, category, quantity } = req.body;
      const distributor = await Distributor.findOne({ user: req.user._id });

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
        owner: distributor._id,
        price,
        category,
        quantity,
        images: imagesLinks,
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

  static fetchSingleProduct = asyncHandler(async (req, res, next) => {
    try {
      const id = req.params.id;
      const product = await Product.findById(id);
      if (!product) {
        return next(new ErrorHandler(error.message, 400));
      }
      return res.status(200).json({
        succes: true,
        message: "Single Product Fetched",
        product,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });

  static fetchDistributorProduct = asyncHandler(async (req, res, next) => {
    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        return next(new ErrorHandler("user not found", 400));
      }
      let products;
      if (user.role === "shop") {
        products = await Product.find({ owner: user.distributor }).populate(
          "owner"
        );
      } else if (user.role === "distributor") {
        const distributor = await Distributor.findOne({ user: req.user._id });
        if (!distributor) {
          return next(new ErrorHandler("Distributor not found", 400));
        }
        products = await Product.find({ owner: distributor._id }).populate(
          "owner"
        );
      }
      // Send the products as a response
      return res.status(200).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });

  static updateProductDetails = asyncHandler(async (req, res, next) => {
    try {
      const { name, description, price, category, quantity } = req.body;
      console.log(req.body);

      const id = req.params.id;
      const product = await Product.findById(id);
      if (!product) {
        return next(new ErrorHandler("No product found", 400));
      }
      let images = [];

      // If images are passed as a string (for a single image)
      if (typeof req.body.images === "string") {
        images.push(req.body.images);
      } else {
        images = req.body.images;
      }
      const imagesLinks = [];
      if (images) {
        // handle image update with cloudianry
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
      }
      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        {
          name: name || product.name,
          description: description || product.description,
          price: price || product.price,
          category: category || product.category,
          quantity: quantity || product.quantity,
          images: imagesLinks,
        },
        { new: true, runValidators: true }
      );
      return res.status(200).json({
        success: true,
        message: "Product updated Successfully",
        updatedProduct,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });

  static updateProductStock = asyncHandler(async (req, res, next) => {
    try {
      const productId = req.params.id;
      const { quantity } = req.body;
      const product = await Product.findByIdAndUpdate(
        productId,
        {
          quantity: quantity,
        },
        { new: true, runValidators: true }
      );
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });

  static fetchAddedProducts = asyncHandler(async (req, res, next) => {
    try {
      const distributor = await Distributor.findOne({ user: req.user._id });
      if (!distributor) {
        return next(new ErrorHandler("Distributor not found", 400));
      }

      const products = await Product.find({ owner: distributor._id }).populate(
        "owner"
      );
      return res.status(200).json({
        success: true,
        message: "Products fetched for distributors",
        products,
      });
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
