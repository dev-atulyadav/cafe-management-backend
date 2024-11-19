import express from "express";
import UserModel from "../models/User.model.js";
import DishModel from "../models/Dish.model.js";

const router = express.Router();

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
        user.orders.push({
          orderId: "DS10R" + orderId,
          orderDate: new Date().toLocaleDateString(),
          orderTiming: new Date().toLocaleTimeString(),
          dishId: dishId,
          quantity: dish.quantity,
          price: totalPrice,
          deliveryLocation: user.address,
          orderStatus: "payment-pending",
          deliveryStatus: "not-delivered",
        });
      }
    });
    user.save();
    return res.json({
      status: 200,
      orders: user.orders,
    });
  }
  return res.json({
    status: 404,
    message: "User not found.",
  });
});

router.post(
  "/update-user-order-status/:email/:orderId/:orderStatus",
  async (req, res) => {
    const { email, orderId, orderStatus } = req.params;
    const user = await UserModel.findOne({ email });
    if (user) {
      const order = user.orders.find((order) => order.orderId === orderId);
      if (order) {
        order.orderStatus = orderStatus;
        user.markModified("orders");
        user.save();
        return res.json({
          status: 200,
          message: "Order status updated successfully",
        });
      } else {
        return res.json({
          status: 404,
          message: "Order not found.",
        });
      }
    }
    return res.json({
      status: 400,
      message: "User not found.",
    });
  }
);
export default router;
