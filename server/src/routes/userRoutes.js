import express from "express";
import AuthController from "../controllers/authController.js";
import { isAuthenticated} from "../middlewares/auth.js";

const userRouter = express.Router();

// ************************* AUTHENTICATION ROUTES **********************
userRouter.put(
  "/change-password",
  isAuthenticated,
  AuthController.changePassword
);

userRouter.post("/register", AuthController.registration);
userRouter.post("/activate", AuthController.activation);
userRouter.post("/login", AuthController.login);
userRouter.post("/logout", isAuthenticated, AuthController.logout);


// ********************* PROFILE MANAGEMENT ROUTES *********************
// userRouter.put(
//   "/update-profile",
//   isAuthenticated,
//   AuthController.updateUserProfile
// );
// userRouter.get("/get-profile", isAuthenticated, AuthController.getUserInfo);
// userRouter.put(
//   "/change-password",
//   isAuthenticated,
//   AuthController.changePassword
// );
// userRouter.put(
//   "/update-avatar",
//   isAuthenticated,
//   AuthController.updateUserAvatar
// );
export default userRouter;
