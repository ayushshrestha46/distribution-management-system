import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import sendMail from "../utils/sendMail.js";
import User from "../models/userModel.js";
import Distributor from "../models/distributorModel.js";
import mongoose from "mongoose";
import cloudinary from "cloudinary";

class DistributorController {
  static addDistributor = asyncHandler(async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    let transactionCommitted = false; // Track if transaction was committed

    try {
      const {
        name,
        email,
        password,
        address,
        phone,
        avatar,
        location,
        contact,
        areaCovered,
        zipCode,
        vat,
      } = req.body;

      const warehousedetails = {
        address: location,
        contactPerson: contact,
      };

      if (
        !name ||
        !email ||
        !password ||
        !phone ||
        !address ||
        !zipCode ||
        !warehousedetails ||
        !vat
      ) {
        return next(
          new ErrorHandler("Please fill in all required fields.", 400)
        );
      }

      // Check if the distributor already exists
      const existsDistributor = await User.findOne({ email }).session(session);
      if (existsDistributor) {
        await session.abortTransaction();
        return next(
          new ErrorHandler("Distributor with this email already exists.", 400)
        );
      }

      // Upload the image to Cloudinary
      let uploadedImage = {};
      if (avatar) {
        const result = await cloudinary.v2.uploader.upload(avatar, {
          folder: "avatars",
          resource_type: "auto",
        });
        uploadedImage = {
          public_id: result.public_id,
          url: result.secure_url,
        };
      } else {
        uploadedImage = {
          public_id: "sample",
          url: "https://cdn.pixabay.com/photo/2024/08/22/10/37/ai-generated-8988977_1280.jpg",
        };
      }

      // Create the User entry
      const distributorUser = await User.create(
        [
          {
            name,
            email,
            password,
            phone,
            address,
            isVerified: true,
            role: "distributor",
            avatar: uploadedImage,
          },
        ],
        { session }
      );

      // Create the Distributor profile
      const newDistributor = await Distributor.create(
        [
          {
            user: distributorUser[0]._id,
            areaCovered,
            zipCode,
            warehouseDetails: warehousedetails,
          },
        ],
        { session }
      );

      // Commit the transaction
      await session.commitTransaction();
      transactionCommitted = true; // Mark transaction as committed

      // SEND MAIL TO THE EMAIL OF THE ADDED DISTRIBUTOR
      const mailData = {
        name: distributorUser[0].name,
        email: distributorUser[0].email,
        password: password,
      };

      const __filename = fileURLToPath(import.meta.url);
      const currentDirectory = path.dirname(__filename);
      const mailPath = path.join(
        currentDirectory,
        "../mails/welcomeDistributor.ejs"
      );

      const html = await ejs.renderFile(mailPath, mailData);

      // Sending the mail to the distributor for his account creation
      try {
        if (distributorUser && newDistributor) {
          await sendMail({
            email: distributorUser[0].email,
            subject: "Account Credentials and Confirmation",
            template: "welcomeDistributor.ejs",
            data: mailData,
          });
        }
      } catch (mailError) {
        console.error("Mail sending failed:", mailError);
        return next(new ErrorHandler("Failed to send email.", 500));
      }

      res.status(201).json({
        success: true,
        message: "Distributor Added successfully.",
      });
    } catch (error) {
      if (!transactionCommitted) {
        await session.abortTransaction(); // Only abort if transaction is NOT committed
      }
      return next(new ErrorHandler(error.message, 500));
    } finally {
      session.endSession();
    }
  });

  static fetchAllDistributors = asyncHandler(async (req, res, next) => {
    try {
      const distributors = await Distributor.find().populate("user");

      if (!distributors.length) {
        return res.status(204).json({
          success: true,
          message: "No distributors found",
          distributors: [],
        });
      }

      return res.status(200).json({
        success: true,
        message: "Distributors fetched successfully",
        distributors,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });

  static fetchSingleDistributor = asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    try {
      const distributor = await Distributor.findById(id).populate("user");
      if (!distributor) {
        return next(new ErrorHandler("Distributor not found", 400));
      }
      return res.status(200).json({
        success: true,
        message: "Distributor fetched successfully",
        distributor,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });

  static updateDistributor = asyncHandler(async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const distributorId = req.params.id;
      console.log(distributorId); // Distributor ID from params
      const {
        name,
        email,
        password,
        address,
        phone,
        avatar,
        location,
        contact,
        areaCovered,
        zipCode,
        vat,
      } = req.body;

      // Find the distributor by ID
      const distributor = await Distributor.findById(distributorId).session(
        session
      );
      if (!distributor) {
        await session.abortTransaction();
        session.endSession();
        return next(new ErrorHandler("Distributor not found", 404));
      }

      // Find the user associated with the distributor
      const user = await User.findById(distributor.user).session(session);
      if (!user) {
        await session.abortTransaction();
        session.endSession();
        return next(
          new ErrorHandler(
            "User associated with the distributor not found",
            404
          )
        );
      }

      // Update user details if provided
      if (name) user.name = name;
      if (email) user.email = email; // Update email if provided
      if (password) user.password = password; // Ensure to hash the password before saving
      if (phone) user.phone = phone;

      // TODO: UPload iamge to cloudinary
      let uploadedImage = user.avatar;

      if (avatar) {
        const result = await cloudinary.v2.uploader.upload(avatar, {
          folder: "avatars", // Optional: Save images in a specific folder
          resource_type: "auto", // Automatically detect the file type
        });
        uploadedImage = {
          public_id: result.public_id,
          url: result.secure_url,
        };
      }
      await user.save({ session });

      // Update distributor details if provided
      if (address) distributor.address = address;
      if (location) distributor.warehouseDetails.address = location;
      if (contact) distributor.warehouseDetails.contactPerson = contact;
      if (areaCovered) distributor.areaCovered = areaCovered;
      if (zipCode) distributor.zipCode = zipCode;
      if (vat) distributor.vat = vat;
      await distributor.save({ session });

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      res.status(200).json({
        success: true,
        message: "Distributor updated successfully",
      });
    } catch (error) {
      // Abort transaction and end session in case of error
      await session.abortTransaction();
      session.endSession();
      return next(new ErrorHandler(error.message, 500));
    }
  });
  static deleteDistributor = asyncHandler(async (req, res, next) => {
    try {
    } catch (error) {
      return next(new ErrorHandler(err.message, 500));
    }
  });

  static getDistributorProfile = asyncHandler(async (req, res, next) => {
    const id = req.user._id;
    const distributor = await Distributor.findOne({ user: id }).populate(
      "user"
    );
    if (!distributor) {
      return next(new ErrorHandler("Distributor not found", 400));
    }
    return res.status(200).json({
      success: true,
      message: "Distributor Profile fetched",
      distributor,
    });
  });
}
export default DistributorController;
