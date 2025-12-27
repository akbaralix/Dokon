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
app.use(express.json());
app.use(cors());

// Telegram va Mongo konfiguratsiyasi
const BOT_TOKEN =
  process.env.BOT_TOKEN || "201270787:AAELpFwtJ7IYefjAIUtxEv39kyuU-jcbo2Y";
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://tursunboyevakbarali807_db_user:iFgH6I9m9ehbqvOf@cluster0.38dhsqh.mongodb.net/?appName=Cluster0";

// MongoDB ga ulanish
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

// ================= VERIFY =====================
app.post("/verify", async (req, res) => {
  try {
    const { code } = req.body;

    const record = await OTP.findOne({ otp: code });

    if (!record) return res.status(400).json({ message: "Noto‘g‘ri kod!" });
    if (Date.now() > record.expiresAt)
      return res.status(400).json({ message: "Kod eskirgan!" });

    const telegramProfile = await axios.get(
      `https://api.telegram.org/bot${BOT_TOKEN}/getChat?chat_id=${record.telegramId}`
    );

    const info = telegramProfile.data.result;

    // Telegram API dan profil rasmi olish
    let avatar = null;
    const photosRes = await axios.get(
      `https://api.telegram.org/bot${BOT_TOKEN}/getUserProfilePhotos?user_id=${record.telegramId}&limit=1`
    );

    if (photosRes.data.result.total_count > 0) {
      const fileId = photosRes.data.result.photos[0][0].file_id;
      const fileRes = await axios.get(
        `https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${fileId}`
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

    await User.findOneAndUpdate({ telegramId: payload.telegramId }, payload, {
      upsert: true,
      new: true,
    });

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.json({ message: "Success", token, user: payload });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server xatoligi!" });
  }
});

// ================= PROFILE =====================
app.get("/profile/:telegramId", async (req, res) => {
  try {
    const telegramId = Number(req.params.telegramId);
    const user = await User.findOne({ telegramId });

    if (!user)
      return res.status(404).json({ message: "Foydalanuvchi topilmadi!" });

    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server xatoligi!" });
  }
});

app.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findOne({
      telegramId: Number(req.user.telegramId),
    });

    if (!user) return res.status(404).json({ message: "User topilmadi!" });

    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server xatoligi!" });
  }
});

// ================= FRONTEND =====================
app.all("*", (req, res) => handle(req, res));


// ================= START SERVER =====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



