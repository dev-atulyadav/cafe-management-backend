import mongoose from "mongoose";

const dishSchema = mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  image: String,
  category: String,
});

export default mongoose.model("Dish", dishSchema);
