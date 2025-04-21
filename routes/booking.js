import express from "express";
import {
  createBooking,
  getBookingById,
  cancelBookingById,
} from "../controllers/booking.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.post("/", auth(["user"]), createBooking);
router.get("/:id", auth(["user"]), getBookingById);
router.delete("/:id", auth(["user"]), cancelBookingById);

export default router;
