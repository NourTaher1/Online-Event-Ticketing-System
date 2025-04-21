import express from "express";
import {
  createEvent,
  getApprovedEvents,
  getAllEvents,
  getEventById,
  updateEventById,
  deleteEventById,
} from "../controllers/event.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.get("/", auth(["user"]),  getApprovedEvents);
router.get("/all" ,auth(["admin"]), getAllEvents);
router.get("/:id", getEventById);
router.post("/", auth(["organizer"]), createEvent);
router.put("/:id", auth(["organizer", "admin"]), updateEventById);
router.delete("/:id", auth(["organizer", "admin"]), deleteEventById);

export default router;
