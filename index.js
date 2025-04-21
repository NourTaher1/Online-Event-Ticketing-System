import express from "express";
import connectDB from "./config/db.js";
// import frontendRoutes from "./routes/frontend.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import eventRoutes from "./routes/event.js";
import bookingRoutes from "./routes/booking.js";
import secrets from "./config/secrets.js";
import cookieParser from "cookie-parser";

const app = express();

// Middlewares
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

connectDB();

// Routes
// app.use("/", frontendRoutes);
app.use("/api/v1", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/events", eventRoutes);
app.use("/api/v1/bookings", bookingRoutes);

app.use((req, res, next) => {
  res.status(404).render("404");
});


const PORT = secrets.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
