import express from "express";
import {
  registerUser,
  verifyUserEmail,
  loginUser,
  forgetPassword,
  logoutUser,
} from "../controllers/user.js";

const router = express.Router();

router.post("/register", registerUser);
router.get("/verifyemail/:id", verifyUserEmail);
router.post("/login", loginUser);
router.post("/forgetPassword", forgetPassword);
router.post("/logout", logoutUser);

export default router;
