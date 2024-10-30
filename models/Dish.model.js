import mongoose from "mongoose";

const DishSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: String,
  image: {
    type: String,
    default:
      "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
  },
  description: String,
});

export default mongoose.model("Dish", DishSchema);
