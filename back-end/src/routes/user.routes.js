import { Router } from "express";
import { addingCartData, gettingUserCartData, loginUser, logoutUser, registerUser, removeCartData } from "../controllers/user.controllers.js";
import { verifyJWT } from "../middleware/auth.middleware.js";


const userRouter = Router();

userRouter.route("/register").post(registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/logout").post(verifyJWT, logoutUser);
userRouter.route("/adding/cart/data").post (verifyJWT, addingCartData);
userRouter.route("/removing/cart/data").post(verifyJWT, removeCartData);
userRouter.route("/getting/user/cart/data").get(verifyJWT, gettingUserCartData);

export default userRouter;