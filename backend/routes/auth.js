import express from "express";
import {
  registerUser,
  verifyUserEmail,
  loginUser,
  forgetPassword,
  logoutUser,
  verifyUser,
} from "../controllers/user.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", registerUser);
router.get("/verifyemail/:id", verifyUserEmail);
router.post("/login", loginUser);
router.post("/forgetPassword", forgetPassword);
router.post("/logout", logoutUser);
router.get("/verify", auth(), verifyUser);

export default router;
