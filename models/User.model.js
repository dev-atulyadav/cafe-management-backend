import mongoose from "mongoose";

export const userSchema = mongoose.Schema({
  name: String,
  email: String,
  phone: Number,
  address: String,
  password: String,
  cart: [],
  orders: [],
});

export default mongoose.model("User", userSchema);
