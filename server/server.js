// server/server.js
import express from "express";
import mongoose from "mongoose";
import OTP from "./OTP.js";
import User from "./user.js";
import axios from "axios";
import jwt from "jsonwebtoken";
import cors from "cors";
import auth from "./auth.js";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// 1. MIDDLEWARES
app.use(express.json());
app.use(cors());

require("./index.js");
const BOT_TOKEN = "8201270787:AAELpFwtJ7IYefjAIUtxEv39kyuU-jcbo2Y";
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://tursunboyevakbarali807_db_user:iFgH6I9m9ehbqvOf@cluster0.38dhsqh.mongodb.net/?appName=Cluster0";
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// 3. API ROUTES (Barcha API so'rovlar Static fayllardan TEPADA turishi kerak)

// ================= VERIFY =====================
app.post("/verify", async (req, res) => {
  try {
    const { code } = req.body;

    const record = await OTP.findOne({ otp: code });

    if (!record) return res.status(400).json({ message: "Noto‘g‘ri kod!" });
    if (Date.now() > record.expiresAt) {
      return res
        .status(400)
        .json({ message: "Kodning amal qilish muddati tugagan!" });
    }

    // Telegramdan foydalanuvchi ma'lumotlarini olish
    const telegramProfile = await axios.get(
      `https://api.telegram.org/bot${BOT_TOKEN}/getChat?chat_id=${record.telegramId}`,
    );

    const info = telegramProfile.data.result;

    // Profil rasmini olish
    let avatar = null;
    const photosRes = await axios.get(
      `https://api.telegram.org/bot${BOT_TOKEN}/getUserProfilePhotos?user_id=${record.telegramId}&limit=1`,
    );

    if (photosRes.data.result.total_count > 0) {
      const fileId = photosRes.data.result.photos[0][0].file_id;
      const fileRes = await axios.get(
        `https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${fileId}`,
      );
      avatar = `https://api.telegram.org/file/bot${BOT_TOKEN}/${fileRes.data.result.file_path}`;
    }

    const payload = {
      telegramId: info.id,
      firstName: info.first_name || "",
      lastName: info.last_name || "",
      username: info.username || "",
      avatar,
    };

    // Foydalanuvchini saqlash yoki yangilash
    const user = await User.findOneAndUpdate(
      { telegramId: payload.telegramId },
      payload,
      {
        upsert: true,
        new: true,
      },
    );

    // JWT Token yaratish
    const token = jwt.sign({ telegramId: user.telegramId }, JWT_SECRET, {
      expiresIn: "30d",
    });

    // Ishlatilgan kodni o'chirib tashlash (xavfsizlik uchun)
    await OTP.deleteOne({ _id: record._id });

    res.json({ message: "Muvaffaqiyatli!", token, user });
  } catch (err) {
    console.error("Verify error:", err.message);
    res.status(500).json({ message: "Server xatoligi yuz berdi!" });
  }
});
// /profile/:telegramId
app.get("/profile/:telegramId", async (req, res) => {
  try {
    const user = await User.findOne({ telegramId: req.user.telegramId });
    if (!user)
      return res.status(404).json({ message: "Foydalanuvchi topilmadi!" });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server xatoligi!" });
  }
});

// /profile (auth bilan)
app.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findOne({
      telegramId: Number(req.params.telegramId),
    });
    if (!user) return res.status(404).json({ message: "Topilmadi!" });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server xatoligi!" });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
