import { asyncHandler } from "../middlewares/asyncHandler.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import ErrorHandler from "../utils/ErrorHandler.js";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";
import sendMail from "../utils/sendMail.js";
import createActivationToken from "../utils/activation.js";
import { sendToken } from "../utils/jwt.js";
import Distributor from "../models/distributorModel.js";
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";
import Payment from "../models/paymentModel.js";

class AdminController {
  static allocateDistributor = asyncHandler(async (req, res, next) => {
    console.log(req.body);
    try {
      const { userId, distributorId } = req.body;
      const user = await User.findById(userId);
      if (!user) {
        return next(new ErrorHandler("User not found", 400));
      }
      const distributor = await Distributor.findById(distributorId);
      if (!distributor) {
        return next(new ErrorHandler("Distributor not found", 400));
      }
      user.distributor = distributor._id;
      user.requestDistributor = "allocated";
      await user.save();
      return res.status(200).json({
        success: true,
        message: "Distributor allocated successfully",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });

  static fetchDistributorAllocationRequest = asyncHandler(
    async (req, res, next) => {
      try {
        const users = await User.find({ requestDistributor: "process" });
        if (!users) {
          return res.status(200).json({
            success: true,
            message: "No allocation request found",
          });
        }
        return res.status(200).json({
          success: true,
          message: "Distributor allocation request fetched successfully",
          users,
        });
      } catch (error) {
        return next(new ErrorHandler(error.message, 500));
      }
    }
  );

  static fetchAllOrders = asyncHandler(async (req, res, next) => {
    try {
      // Fetch all orders and populate both 'user' and 'distributor'
      const orders = await Order.find()
        .populate("user", "name email")
        .populate({
          path: "distributor",
          select: "user", // Only select the user reference from distributor
          populate: {
            path: "user", // Then populate the actual user details
            select: "name email",
          },
        }); // Populate distributor details (only name and email)

      // Send the orders as a response
      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });

  static fetchAllProducts = asyncHandler(async (req, res, next) => {
    try {
      const products = await Product.find().populate({
        path: "owner", // Populate the Distributor
        select: "user warehouseDetails", // Only fetch the 'user' field from Distributor
        populate: {
          path: "user", // Then populate the User inside Distributor
          select: "name email", // Only fetch the 'name' field from User
        },
      });
      if (!products) {
        return res.status(200).json({
          success: true,
          message: "No Products found",
        });
      }
      res.status(200).json({
        success: true,
        message: "Products Fetched Successfully",
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });

  static fetchAllCustomers = asyncHandler(async (req, res, next) => {
    try {
      const users = await User.find({ role: "shop" }).populate({
        path: "distributor", // Populate the Distributor
        select: "user", // Only fetch the 'user' field from Distributor
        populate: {
          path: "user", // Then populate the User inside Distributor
          select: "name email", // Only fetch the 'name' field from User
        },
      });
      if (!users) {
        return res
          .status(200)
          .json({ success: true, message: "No user Found" });
      }

      return res.status(200).json({
        success: true,
        message: "Users Fetched successfully",
        users,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });

  static banUserByAdmin = asyncHandler(async (req, res, next) => {
    try {
      const userId = req.params.id;
      const user = await User.findById(userId);
      if (!user) {
        return next(new ErrorHandler("User not found", 400));
      }
      if (user.isBanned) {
        user.isBanned = false;
      } else {
        user.isBanned = true;
      }
      await user.save();
      return res.status(200).json({
        success: true,
        message: user.isBanned
          ? "User banned Successfully"
          : "User unbanned Successfully",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });

  static addUserByAdmin = asyncHandler(async (req, res, next) => {
    try {
      const { name, email, password, address, phone } = req.body;
      if (!name) {
        return next(new ErrorHandler("Name cannot be empty", 400));
      }

      if (!email) {
        return next(new ErrorHandler("Email cannot be empty", 400));
      }

      if (!password) {
        return next(new ErrorHandler("Password cannot be empty", 400));
      }

      if (!address) {
        return next(new ErrorHandler("Address cannot be empty", 400));
      }
      if (!phone) {
        return next(new ErrorHandler("Phone cannot be empty", 400));
      }

      const existUser = await User.findOne({ email });
      if (existUser) {
        return next(new ErrorHandler("User already exists", 400));
      }
      await User.create({
        name,
        email,
        password,
        isVerified: true,
        address,
        phone,
      });
      res.status(201).json({
        success: true,
        message: "User Added Successfully",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });

  static editUserByAdmin = asyncHandler(async (req, res, next) => {
    try {
      const userId = req.params.id;
      const user = await User.findById(userId);
      const { name, email, phone, address } = req.body;
      if (name) {
        user.name = name;
      }
      if (email) {
        user.email = email;
      }
      if (phone) {
        user.phone = phone;
      }
      if (address) {
        user.address = address;
      }
      await user.save();
      return res.status(200).json({
        success: true,
        message: "User Updated Successfully",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });

  static viewAllPaymentsByAdmin = asyncHandler(async (req, res, next) => {
    try {
      const payments = await Payment.find()
        .populate({
          path: "user",
          select: "name email",
        })
        .populate({
          path: "distributor",
          select: "user", // Only select the user reference from distributor
          populate: {
            path: "user", // Then populate the actual user details
            select: "name email",
          },
        })
        .sort({ createdAt: -1 });

      // Format the response to flatten the structure
      const formattedPayments = payments.map((payment) => ({
        _id: payment._id,
        amount: payment.amount,
        status: payment.status,
        paymentMethod: payment.paymentMethod,
        pidx: payment.pidx,
        createdAt: payment.createdAt,
        user: {
          _id: payment.user._id,
          name: payment.user.name,
          email: payment.user.email,
        },
        distributor: {
          _id: payment.distributor._id,
          name: payment.distributor.user.name,
          email: payment.distributor.user.email,
        },
        order: payment.order,
      }));

      res.status(200).json({
        success: true,
        count: payments.length,
        payments: formattedPayments,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });
}

export default AdminController;
