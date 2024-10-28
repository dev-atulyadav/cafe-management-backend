import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import session from "express-session";
import UserModel from "./models/User.model.js";
import bcrypt from "bcryptjs";
import DishModel from "./models/Dish.model.js";
const app = express();
const port = 3000;

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);
app.use((req, res, next) => {
  console.log("Session:", req.session);
  next();
});
// Connect to MongoDB database
try {
  mongoose
    .connect("mongodb://localhost:27017/cafe-management")
    .then(() => console.log("Connected to MongoDB"));
} catch (error) {
  console.error("Error connecting to MongoDB:", error);
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

app.post("/register", async (req, res) => {
  const { name, email, phone, address, password } = req.body;
  console.log(name, email, phone, address, password);

  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    return res.json({ status: 400, message: "User already exists" });
  } else {
    const hasedPassword = bcrypt.hashSync(password, 10);
    const newUser = new UserModel({
      name,
      email,
      phone,
      address,
      password: hasedPassword,
      cart: [],
      orders: [],
    });
    newUser.save();
  }

  console.log(email, password);
  return res.json({ status: 201, message: "User Created!" });
});

app.get("/login/:email/:password", async (req, res) => {
  const { email, password } = req.params;
  const existingUser = await UserModel.findOne({ email });
  console.log();

  if (existingUser) {
    const isValidPassword = bcrypt.compareSync(password, existingUser.password);
    if (isValidPassword) {
      return res.json({ status: 200, message: "User logged in!" });
    } else {
      return res.json({ status: 401, message: "Invalid password!" });
    }
  } else {
    return res.json({ status: 404, message: "Please register first!" });
  }
});
app.get("/addToCart/:dishId/:userEmail", async (req, res) => {
  const { dishId, userEmail } = req.params;
  const existingUser = await UserModel.findOne({ email: userEmail });
  console.log(dishId);
  console.log(userEmail);
  let quantity = 1;

  if (existingUser) {
    const { cart } = existingUser;
    if (cart.length > 0) {
      for (const element of cart) {
        if (element.id === dishId) {
          console.log(cart);

          element.quantity += quantity;
          existingUser.save();
          return res.json({ status: 200, message: "Dish added to cart!" });
        } else {
          const newDish = { dishId, quantity };
          cart.push(newDish);
          existingUser.save();
        }
        return res.json({ status: 200, message: "Dish added to cart!" });
      }
    } else {
      const newDish = { dishId, quantity };
      cart.push(newDish);
      existingUser.save();
      return res.json({ status: 200, message: "Dish added to cart!" });
    }
  }
  return res.json({ status: 404, message: "User not found!" });
});

app.get("/getUserByEmail/:email", async (req, res) => {
  const { email } = req.params;
  const existingUser = await UserModel.findOne({ email });
  const user = {
    name: existingUser.name,
    email: existingUser.email,
    phone: existingUser.phone,
    address: existingUser.address,
    cart: existingUser.cart,
    orders: existingUser.orders,
  };
  if (existingUser) {
    return res.json({
      status: 200,
      message: "User found!",
      data: user,
    });
  }
  return res.json({ status: 404, message: "User not found!" });
});

app.delete("/deleteUserByEmail", async (req, res) => {
  const { email } = req.body;
  const existingUser = await UserModel.findOneAndDelete({ email });
  if (!existingUser) {
    return res.json({ status: 200, message: "User deleted!" });
  }
  return res.json({ status: 404, message: "User not found!" });
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
