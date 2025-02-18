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

class AuthController {
  static registration = asyncHandler(async (req, res, next) => {
    try {
      const { name, email, password, shop } = req.body;
      console.log(req.body);

      if (!name) {
        return next(new ErrorHandler("Name cannot be empty", 400));
      }

      if (!email) {
        return next(new ErrorHandler("Email cannot be empty", 400));
      }
      if (!password) {
        return next(new ErrorHandler("Name cannot be empty", 400));
      }
      if (!shop) {
        return next(new ErrorHandler("Shop cannot be empty", 400));
      }
      const isEmailExist = await User.findOne({ email });

      if (isEmailExist) {
        return next(new ErrorHandler("Email already exists", 400));
      }
      // putting the destructured object variable in one object known as user
      const user = {
        name,
        email,
        password,
        shop,
      };

      const activationToken = createActivationToken(user);
      const activationCode = activationToken.activationCode;

      const data = { user: { name: user.name }, activationCode };
      // getting the current directory
      const __filename = fileURLToPath(import.meta.url);
      const currentDirectory = path.dirname(__filename);

      const mailPath = path.join(
        currentDirectory,
        "../mails/activationMail.ejs"
      );

      // console.log('This is the mailPath', mailPath);
      const html = await ejs.renderFile(mailPath, data);

      // Send mail function call
      try {
        await sendMail({
          email: user.email,
          subject: "Activate your account",
          template: "activationMail.ejs",
          data,
        });
        res.status(201).json({
          success: true,
          message: `Please check your email: ${user.email} to activate your account.`,
          activationToken: activationToken.token,
        });
      } catch (err) {
        return next(new ErrorHandler(err.message, 400));
      }
    } catch (err) {
      return next(new ErrorHandler(err.message, 400));
    }
  });
  static activation = asyncHandler(async (req, res, next) => {
    try {
      const { activation_code, activation_token } = req.body;

      const newUser = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET
      );
      if (newUser.activationCode !== activation_code) {
        return next(new ErrorHandler("Invalid activation Code", 400));
      }

      const { name, email, password, shop } = newUser?.userdata;
      console.log(newUser?.userdata);

      const existUser = await User.findOne({ email });

      if (existUser) {
        return next(new ErrorHandler("Email already exits", 400));
      }

      await User.create({
        name,
        email,
        password,
        shop,
      });

      res.status(201).json({
        success: true,
        message: "User has been successfully created",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  });
  static login = asyncHandler(async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return next(
          new ErrorHandler("Please enter your email or Password", 400)
        );
      }
      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("Invalid Email or Password", 400));
      }

      const isPasswordMatch = await user.comparePassword(password);

      if (!isPasswordMatch) {
        return next(new ErrorHandler("Invalid Email or Password", 400));
      }

      sendToken(user._id, res);

      delete user._doc.password;

      // response to the frontend
      res.status(201).json({
        success: true,
        message: "User is successfully logged in",
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  });
  static logout = asyncHandler(async (req, res, next) => {
    try {
      res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0),
      });
      res.status(200).json({
        success: true,
        message: "User logged out successfully",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  });
}

export default AuthController;
