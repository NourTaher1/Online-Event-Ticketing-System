import express from "express";
import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEventById,
  deleteEventById,
} from "../controllers/event.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.get("/", getAllEvents);
router.get("/:id", getEventById);
router.post("/", auth(["organizer"]), createEvent);
router.put("/:id", auth(["organizer", "admin"]), updateEventById);
router.delete("/:id", auth(["organizer", "admin"]), deleteEventById);

export default router;
