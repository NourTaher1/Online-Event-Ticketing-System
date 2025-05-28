import Event from "../models/Event.js";

export const createEvent = async (req, res) => {
  try {
    const organizerId = req.user.id; // Get the ID from decoded JWT

    const event = await Event.create({ ...req.body, organizer: organizerId });

    res.status(201).json({ message: "Event created successfully", event });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: "Validation Error", errors });
    }

    res
      .status(500)
      .json({ message: "Error creating event", error: error.message });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate("organizer", "name email");
    res.status(200).json(events);
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: "Validation Error", errors });
    }

    res
      .status(500)
      .json({ message: "Error getting events", error: error.message });
  }
};

export const getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user.id }).populate("organizer", "name email");
    res.status(200).json(events);
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: "Validation Error", errors });
    }

    res
      .status(500)
      .json({ message: "Error getting your events", error: error.message });
  }
};

export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      "organizer",
      "name email"
    );
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.status(200).json(event);
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: "Validation Error", errors });
    }

    res
      .status(500)
      .json({ message: "Error getting event", error: error.message });
  }
};

export const updateEventById = async (req, res) => {
  try {
    if (req.body.status && req.user && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Only admins can update the status" });
    }

    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("organizer", "name email");

    if (!event) return res.status(404).json({ message: "Event not found" });
    res.status(200).json({ message: "Event updated", event });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: "Validation Error", errors });
    }

    res
      .status(500)
      .json({ message: "Error updating event", error: error.message });
  }
};

export const deleteEventById = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: "Validation Error", errors });
    }

    res
      .status(500)
      .json({ message: "Error deleting event", error: error.message });
  }
};
