import mongoose from "mongoose";

export const userSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
  cart: [],
});

export default mongoose.model("User", userSchema);
