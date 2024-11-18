import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import session from "express-session";
import dishRoutes from "./routes/dish.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import userRoutes from "./routes/user.routes.js";
import orderRoutes from "./routes/order.routes.js"


const app = express();
const port = 3000;

// Middleware setup
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/cafe-management")
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

// Routes
app.use("/user", userRoutes);
app.use("/order", orderRoutes);
app.use("/dishes", dishRoutes);

// Error handling middleware
app.use(errorHandler);

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
