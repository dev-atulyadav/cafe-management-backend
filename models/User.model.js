import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  address: String,
  password: { type: String, required: true },
  cart: { type: Array, default: [] },
  orders: { type: Array, default: [] },
});

export default mongoose.model("User", UserSchema);
