import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  getUserBookings,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
} from "../controllers/user.js";

import auth from "../middlewares/auth.js";

const router = express.Router();

router.get("/profile", auth(["user", "organizer", "admin"]), getUserProfile);
router.put("/profile", auth(["user", "organizer", "admin"]), updateUserProfile);
router.get("/bookings", auth(["user"]), getUserBookings);

router.get("/", auth(["admin"]), getAllUsers);
router.get("/:id", auth(["admin"]), getUserById);
router.put("/:id", auth(["admin"]), updateUserById);
router.delete("/:id", auth(["admin"]), deleteUserById);

export default router;
