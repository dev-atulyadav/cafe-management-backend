import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import UserModel from "./models/User.model.js";
import bcrypt from "bcryptjs";
import DishModel from "./models/Dish.model.js";
const app = express();
const port = 3000;

// Connect to MongoDB database
try {
  mongoose
    .connect("mongodb://localhost:27017/cafe-management")
    .then(() => console.log("Connected to MongoDB"));
} catch (error) {
  console.log(error);
}

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    data: "Hello world!",
  });
});

app.post("/addDish", async (req, res) => {
  if (req.body) {
    const { name, price, description } = req.body;
    console.log(name, price, description);

    const newDish = new DishModel({
      name,
      price,
      description,
    });
    newDish.save();
    return res.json({ status: 400, message: "Invalid request" });
  } else {
    return res.json({ status: 400, message: "Invalid request" });
  }
});

app.get("/register/:email/:password", (req, res) => {
  const { email, password } = req.params;
  const hasedPassword = bcrypt.hashSync(req.params.password, 10);
  const newUser = new UserModel({
    email,
    password: hasedPassword,
    cart: [],
  });
  newUser.save();
  console.log(newUser);

  console.log(email, password);
  return res.json({ status: 201, message: "User Created!" });
});

app.get("/login/:email/:password", async (req, res) => {
  const { email, password } = req.params;
  const existingUser = await UserModel.findOne({ email });
  console.log(existingUser);

  if (existingUser) {
    const isValidPassword = bcrypt.compareSync(password, existingUser.password);
    if (isValidPassword) {
      return res.json({ status: 200, message: "User logged in!" });
    } else {
      return res.json({ status: 401, message: "Invalid password!" });
    }
  } else {
    return res.json({ status: 404, message: "Plese login" });
  }
});
app.get("/addToCart/:dishId/:userEmail", async (req, res) => {
  const { dishId, userEmail } = req.params;
  const existingUser = await UserModel.findOne({ email: userEmail });
  if (existingUser) {
    const existingCart = existingUser.cart.find(
      (item) => item.dishId === dishId
    );
    if (existingCart) {
      existingCart.quantity += 1;
    } else {
      existingUser.cart.push({ dishId: dishId, quantity: 1 });
    }
    existingUser.save();
    return res.json({ status: 200, message: "Dish added to cart!" });
  } else {
    return res.json({ status: 404, message: "User not found!" });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
 