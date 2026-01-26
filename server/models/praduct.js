import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    productId: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    narx: { type: Number, required: true },
    rasm: { type: String, required: true },
  },
  { timestamps: true },
);

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
