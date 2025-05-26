import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
      unique: [true, "Event title is already taken"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Event description is required"],
      minlength: [10, "Description must be at least 10 characters long"],
    },
    date: {
      type: Date,
      required: [true, "Event date is required"],
      validate: {
        validator: function (v) {
          return v && v > new Date();
        },
        message: "Event date must be in the future",
      },
    },
    location: {
      type: String,
      required: [true, "Event location is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Event category is required"],
      enum: {
        values: [
          "music",
          "sports",
          "theater",
          "business",
          "comedy",
          "education",
          "technology",
          "other",
        ],
        message: "Invalid event category",
      },
      lowercase: true,
    },
    status: {
      type: String,
      enum: ["pending", "upcoming", "completed", "cancelled"],
      default: "pending",
    },
    images: {
      type: [String],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.every((url) => typeof url === "string");
        },
        message: "Images must be an array of strings",
      },
      default: [ "./img/defaultEvent1.png", "./img/defaultEvent2.png", "./img/defaultEvent3.png",],
    },
    ticketPrice: {
      type: Number,
      required: [true, "Ticket price is required"],
      min: [0, "Ticket price must be a positive number"],
    },
    totalTickets: {
      type: Number,
      required: [true, "Total tickets are required"],
      min: [1, "Total tickets must be at least 1"],
    },
    remainingTickets: {
      type: Number,
      min: [0, "Remaining tickets must be a positive number"],
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Organizer is required"],
    },
  },
  {
    timestamps: true,
  }
);

// Auto-calculate remainingTickets if not provided
eventSchema.pre("save", function (next) {
  if (this.isNew && this.remainingTickets === undefined) {
    this.remainingTickets = this.totalTickets;
  }
  next();
});

const Event = mongoose.model("Event", eventSchema);

export default Event;
