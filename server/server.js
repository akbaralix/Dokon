import express from "express";
import mongoose from "mongoose";
import axios from "axios";
import jwt from "jsonwebtoken";
import cors from "cors";
import dotenv from "dotenv";

// Modellar va Middleware
import OTP from "./OTP.js";
import User from "./models/user.js";
import Order from "./models/order.js";
import Product from "./models/praduct.js"; // Fayl nomi 'praduct.js' ekanligiga amin bo'ling
import auth from "./auth.js";

dotenv.config();

const app = express();

// Middleware sozlamalari
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Muhit o'zgaruvchilari
const BOT_TOKEN = process.env.BOT_TOKEN;
const JWT_SECRET = process.env.JWT_SECRET || "default_secret_key_123";
const MONGO_URI = process.env.MONGO_URI;

// MongoDB ulanishi
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ================= ASOSIY YO'NALISH (Render Health Check) =====================
app.get("/", (req, res) => {
  res.send("Server muvaffaqiyatli ishlayapti! 🚀");
});

// ================= VERIFY =====================
app.post("/verify", async (req, res) => {
  try {
    const { code } = req.body;
    const record = await OTP.findOne({ otp: code });

    if (!record) return res.status(400).json({ message: "Noto‘g‘ri kod!" });

    if (Date.now() > new Date(record.expiresAt).getTime()) {
      return res.status(400).json({ message: "Kodning amal qilish muddati tugagan!" });
    }

    const { data: chatRes } = await axios.get(
      `https://api.telegram.org/bot${BOT_TOKEN}/getChat?chat_id=${record.telegramId}`
    );
    const info = chatRes.result;

    let avatar = null;
    try {
      const { data: photoRes } = await axios.get(
        `https://api.telegram.org/bot${BOT_TOKEN}/getUserProfilePhotos?user_id=${record.telegramId}&limit=1`
      );
      if (photoRes.result.total_count > 0) {
        const fileId = photoRes.result.photos[0][0].file_id;
        const { data: fileRes } = await axios.get(
          `https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${fileId}`
        );
        avatar = `https://api.telegram.org/file/bot${BOT_TOKEN}/${fileRes.result.file_path}`;
      }
    } catch (photoErr) {
      console.error("Avatar olishda xato:", photoErr.message);
    }

    const user = await User.findOneAndUpdate(
      { telegramId: record.telegramId },
      {
        firstName: info.first_name || "",
        lastName: info.last_name || "",
        username: info.username || "",
        avatar,
      },
      { upsert: true, new: true }
    );

    const token = jwt.sign({ telegramId: user.telegramId }, JWT_SECRET, {
      expiresIn: "30d",
    });

    await OTP.deleteOne({ _id: record._id });
    res.json({ message: "Muvaffaqiyatli!", token, user });
  } catch (err) {
    console.error("Verify error:", err.message);
    res.status(500).json({ message: "Server xatoligi!" });
  }
});

// ================= PROFILE =====================
app.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findOne({ telegramId: req.user.telegramId });
    if (!user) return res.status(404).json({ message: "Foydalanuvchi topilmadi!" });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server xatoligi!" });
  }
});

// ================= ORDERS =====================
app.post("/api/orders", auth, async (req, res) => {
  try {
    const { items, totalPrice } = req.body;
    const newOrder = new Order({
      userId: req.user.telegramId,
      items,
      totalAmount: totalPrice,
      status: "kutilmoqda",
    });

    await newOrder.save();
    res.status(201).json({ success: true, message: "Buyurtma saqlandi!", order: newOrder });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/api/my-orders", auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.telegramId }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete("/api/orders/:id", auth, async (req, res) => {
  try {
    const orderId = req.params.id;
    const deletedOrder = await Order.findOneAndDelete({
      _id: orderId,
      userId: req.user.telegramId,
    });

    if (!deletedOrder) {
      return res.status(404).json({ message: "Buyurtma topilmadi" });
    }

    // Admin bildirishnomasi
    const ADMIN_CHAT_ID = "907402803";
    const deleteMessage = `🗑 **BUYURTMA BEKOR QILINDI**\n👤 Mijoz: ${req.user.telegramId}\n🆔 ID: #${orderId}\n💰 Summa: ${deletedOrder.totalAmount.toLocaleString()} so'm`;

    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      chat_id: ADMIN_CHAT_ID,
      text: deleteMessage,
      parse_mode: "Markdown",
    });

    res.json({ success: true, message: "O'chirildi" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ================= PRODUCTS =====================
app.post("/api/products", async (req, res) => {
  try {
    const { title, narx, rasm } = req.body;
    const newProduct = new Product({
      productId: Date.now(),
      title,
      narx: Number(narx),
      rasm,
    });
    await newProduct.save();
    res.status(201).json({ success: true, product: newProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ================= SERVER START =====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
