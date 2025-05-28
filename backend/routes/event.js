import express from "express";
import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEventById,
  deleteEventById,
  getMyEvents,
} from "../controllers/event.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.get("/", getAllEvents);
router.get("/my-events", auth(), getMyEvents);
router.get("/:id", getEventById);
router.post("/", auth(["organizer"]), createEvent);
router.put("/:id", updateEventById);
router.delete("/:id", auth(["organizer", "admin"]), deleteEventById);

export default router;
