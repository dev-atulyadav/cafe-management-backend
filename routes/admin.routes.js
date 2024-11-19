import express from "express";
import bcrypt from "bcryptjs";
import AdminModel from "../models/Admin.model.js";
import UserModel from "../models/User.model.js";

const router = express.Router();

router.post("/sign-up", async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const admin = new AdminModel({ email, password: hashedPassword });
  const usersData = await UserModel.find();
  const filteredUser = [];
  usersData.forEach((user) => {
    user.orders.forEach((order) => {
      if (order.orderStatus === "payment-successful") {
        filteredUser.push({
          userName: user.name,
          userEmail: user.email,
          userPhone: user.phone,
          order: {
            orderId: order.orderId,
            deliveryStatus: order.deliveryStatus,
            deliveryLocation: order.deliveryLocation,
          },
          dish: {
            dishId: order.dishId,
            dishPrice: order.price,
            quantity: order.quantity,
          },
        });
      }
    });
  });
  try {
    admin.users = filteredUser;
    await admin.save();
    res.json({
      status: 200,
      message: "Admin created successfully",
      data: {
        email: admin.email,
        users: admin.users,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await AdminModel.findOne({ email });
  if (user) {
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const admin = {
        email: user.email,
        user: user.users,
      };
      res.json({ status: 201, message: "Login Successfully", data: admin });
    } else {
      res.json({ status: 401, message: "Invalid Password" });
    }
  } else {
    res.json({ status: 404, message: "Invalid Email" });
  }
});
router.get("/getAdminByEmail/:email", async (req, res) => {
  const { email } = req.params;
  const admin = await AdminModel.findOne({ email });
  if (admin) {
    res.json({
      status: 200,
      message: "Admin found",
      data: {
        email: admin.email,
        users: admin.users,
      },
    });
  } else {
    res.json({ status: 404, message: "Admin not found" });
  }
});

export default router;
