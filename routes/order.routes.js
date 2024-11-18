import express from "express";
import UserModel from "../models/User.model.js";
import DishModel from "../models/Dish.model.js";

const router = express.Router();
//not completed

router.post("/add-order/:email/:dishId", async (req, res) => {
  const { email, dishId } = req.params;
  const user = await UserModel.findOne({ email });
  const dishData = await DishModel.findById({ _id: dishId });
  const dishPrice = dishData.price;
  let totalPrice = dishPrice;
  if (user) {
    const cart = user.cart;
    cart.forEach((dish, index) => {
      if (dish.dishId == dishId) {
        // Generate orderId if dishId matched
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hour = date.getHours();
        const minute = date.getMinutes();
        const second = date.getSeconds();
        const orderId = `${year}${month}${day}${hour}${minute}${second}`;

        totalPrice *= Number(dish.quantity);
        cart.splice(index, 1);
        user.orders.push( {
          orderId: "DS10R" + orderId,
          dishId: dishId,
          quantity: dish.quantity,
          price: totalPrice,
          deliveryLocation: user.address,
          orderStatus: "payment pending",
        });
      }
    });
  }
  user.save();
  return res.json({
    orders:user.orders,
  });
});

export default router;