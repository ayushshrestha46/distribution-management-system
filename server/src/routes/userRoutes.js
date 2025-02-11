import express from 'express'
import { activateUser, loginUser, logoutUser, registerUser } from '../controllers/userController.js';
import { isAuthenticated } from '../middlewares/auth.js';

const userRouter = express.Router()

userRouter.post('/register', registerUser)
userRouter.post('/activate', activateUser)
userRouter.post('/login', loginUser)
userRouter.post('/logout', isAuthenticated, logoutUser)

export default userRouter;