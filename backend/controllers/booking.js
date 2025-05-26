import Booking from "../models/Booking.js";
import Event from "../models/Event.js";

export const createBooking = async (req, res) => {
  try {
    const { event, quantity } = req.body;

    if (!quantity || quantity <= 0 || !Number.isInteger(quantity)) {
      return res.status(400).json({ message: "Invalid quantity. It must be a positive integer." });
    }

    const eventDetails = await Event.findById(event);
    if (!eventDetails) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (quantity > eventDetails.remainingTickets) {
      return res.status(400).json({ message: "Not enough tickets available" });
    }

    const totalPrice = eventDetails.ticketPrice * quantity;

    const booking = await Booking.create({
      user: req.user.id, 
      event,
      quantity,
      totalPrice,
    });

    eventDetails.remainingTickets -= quantity;
    await eventDetails.save();

    res.status(201).json({ message: "Booking created successfully", booking });
  } catch (error) {
    res.status(500).json({ message: "Error creating booking", error: error.message });
  }
};


export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("event").populate("user");
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: "Error fetching booking", error });
  }
};


export const cancelBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status === "canceled") {
      return res.status(400).json({ message: "Booking is already canceled" });
    }

    booking.status = "canceled";
    await booking.save();

    const event = await Event.findById(booking.event);
    event.remainingTickets += booking.quantity;
    await event.save();

    res.status(200).json({ message: "Booking canceled successfully", booking });
  } catch (error) {
    res.status(500).json({ message: "Error canceling booking", error });
  }
};
