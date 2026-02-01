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
import Product from "./models/praduct.js";
import auth from "./auth.js";
import "./index.js";

dotenv.config();

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(cors());

// O'zgaruvchilarni .env dan olish yoki default qiymat berish
const BOT_TOKEN =
  process.env.BOT_TOKEN || "8201270787:AAELpFwtJ7IYefjAIUtxEv39kyuU-jcbo2Y";
const JWT_SECRET = process.env.JWT_SECRET || "maxfiy_kalit_soz_123";
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ================= VERIFY =====================
app.post("/verify", async (req, res) => {
  try {
    const { code } = req.body;
    const record = await OTP.findOne({ otp: code });

    if (!record) return res.status(400).json({ message: "Noto‘g‘ri kod!" });

    // Vaqtni tekshirish
    if (Date.now() > new Date(record.expiresAt).getTime()) {
      return res
        .status(400)
        .json({ message: "Kodning amal qilish muddati tugagan!" });
    }

    // Telegramdan ma'lumot olish
    const { data: chatRes } = await axios.get(
      `https://api.telegram.org/bot${BOT_TOKEN}/getChat?chat_id=${record.telegramId}`,
    );
    const info = chatRes.result;

    // Avatar olish
    let avatar = null;

    try {
      const photoRes = await axios.get(
        `https://api.telegram.org/bot${BOT_TOKEN}/getUserProfilePhotos`,
        {
          params: {
            user_id: record.telegramId,
            limit: 1,
          },
        },
      );

      if (photoRes.data.ok && photoRes.data.result.total_count > 0) {
        const fileId = photoRes.data.result.photos[0][0].file_id;

        const fileRes = await axios.get(
          `https://api.telegram.org/bot${BOT_TOKEN}/getFile`,
          {
            params: { file_id: fileId },
          },
        );

        avatar = `https://api.telegram.org/file/bot${BOT_TOKEN}/${fileRes.data.result.file_path}`;
      }
    } catch (err) {
      console.log("Avatar olishda xato:", err.message);
    }

    const user = await User.findOneAndUpdate(
      { telegramId: record.telegramId },
      {
        firstName: info.first_name || "",
        lastName: info.last_name || "",
        username: info.username || "",
        userId: info.id || "",
        avatar,
      },
      { upsert: true, new: true },
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

app.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findOne({ telegramId: req.user.telegramId });
    if (!user)
      return res.status(404).json({ message: "Foydalanuvchi topilmadi!" });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server xatoligi!" });
  }
});
app.post("/api/orders", auth, async (req, res) => {
  try {
    const { items, totalPrice } = req.body;

    const newOrder = new Order({
      userId: req.user.telegramId,
      items: items,
      totalAmount: totalPrice,
      status: "kutilmoqda",
    });

    await newOrder.save();
    res.status(201).json({
      success: true,
      message: "Buyurtma bazaga saqlandi!",
      order: newOrder,
    });
  } catch (error) {
    console.error("Order error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/api/my-orders", auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.telegramId }).sort({
      createdAt: -1,
    });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete("/api/orders/:id", auth, async (req, res) => {
  try {
    const orderId = req.params.id;
    const telegramId = req.user.telegramId;

    const deletedOrder = await Order.findOneAndDelete({
      _id: orderId,
    });

    if (!deletedOrder) {
      return res
        .status(404)
        .json({ message: "Buyurtma topilmadi yoki o'chirishga ruxsat yo'q" });
    }

    // --- ADMIN UCHUN TELEGRAM XABAR ---
    const BOT_TOKEN = process.env.BOT_TOKEN;
    const ADMIN_CHAT_ID = "907402803";

    const deleteMessage = `
🗑 **BUYURTMA O'CHIRILDI (BAZADAN)**
----------------------------
👤 <b>Foydalanuvchi:</b> <a href="tg://user?id=${deletedOrder.userId}">${deletedOrder.userId}</a>

🆔 <b>Order ID:</b> #${orderId}
💰 <b>Summa:</b> ${deletedOrder.totalAmount.toLocaleString()} so'm

⚠️ <i>Ushbu buyurtma foydalanuvchi tomonidan bekor qilindi va bazadan o'chirildi.</i>
    `;

    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      chat_id: ADMIN_CHAT_ID,
      text: deleteMessage,
      parse_mode: "HTML",
    });

    res.json({ success: true, message: "Buyurtma bazadan o'chirildi" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

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

    res.status(201).json({
      soccess: true,
      message: "Mahsulot bazaga saqlandi",
      product: newProduct,
    });
  } catch (error) {
    console.error(error);
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
app.get("/", (req, res) => {
  res.send("Server muvaffaqiyatli ishlayapti! 🚀");
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
