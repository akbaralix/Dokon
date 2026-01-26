import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: Number,
    ref: "User", // User modeliga bog'lash
    required: true,
  },
  items: [
    {
      productId: Number, // yoki String, frontend'dagi id turiga qarab
      title: String,
      narx: Number,
      quantity: Number,
      rasm: String,
    },
  ],
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["kutilmoqda", "tasdiqlandi", "yakunlandi", "bekor qilindi"],
    default: "kutilmoqda",
  },
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
