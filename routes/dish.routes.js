import express from "express";
import DishModel from "../models/Dish.model.js";
import UserModel from "../models/User.model.js";

const router = express.Router();

router.post("/addDish", async (req, res) => {
  const { name, price, image, category, description } = req.body;

  if (!name || !price) {
    return res.status(400).json({ message: "Name and price are required." });
  }

  try {
    const newDish = new DishModel({
      name,
      price,
      image,
      category,
      description,
    });
    await newDish.save();
    res.status(201).json({ message: "Dish added successfully", data: newDish });
  } catch (error) {
    console.error("Error adding dish:", error);
    res.status(500).json({ message: "Error adding dish" });
  }
});

router.get("/getAllDish", async (req, res) => {
  try {
    const dishes = await DishModel.find();
    res.json({ status: 200, data: dishes });
  } catch (error) {
    console.error("Error fetching dishes:", error);
    res.json({ status: 500, message: "Error fetching dishes" });
  }
});

router.get("/getDishByDishId/:dishId", async (req, res) => {
  const { dishId } = req.params;

  try {
    const dish = await DishModel.findById(dishId);
    if (!dish) {
      return res.json({ status: 404, message: "Dish not found!" });
    }
    res.json({ status: 200, message: "Dish found!", data: dish });
  } catch (error) {
    console.error("Error fetching dish:", error);
    res.json({ status: 500, message: "Error fetching dish" });
  }
});
router.post("/addToCart/:email", async (req, res) => {
  const { email } = req.params;
  const cart = req.body;
  const existingUser = await UserModel.findOne({ email });
  console.log(
    cart.map((value) => {
      return value;
    })
  );
  if (existingUser) {
    existingUser.cart = cart;
    existingUser.save();
    return res.json({
      status: 200,
      message: "Dish added to cart!",
      cart: cart,
    });
  }
  return res.json({
    status: 404,
    message: "User not found",
  });
});

export default router;
