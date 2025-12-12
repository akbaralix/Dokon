const express = require("express");
const mongoose = require("mongoose");
const OTP = require("./OTP");
const User = require("./user");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const auth = require("./auth");
require("dotenv").config();

const app = express();
app.use(express.json());

app.use(cors({ origin: "http://localhost:3000" }));
require("./index.js");

require("./index.js");

mongoose
  .connect(process.env.MONGO_URI)
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
      `https://api.telegram.org/bot${process.env.BOT_TOKEN}/getChat?chat_id=${record.telegramId}`
    );

    const info = telegramProfile.data.result;

    // Telegram API dan profil rasmi olish
    let avatar = null;

    // 1. User profil rasmlarini so‘rov qilamiz
    const photosRes = await axios.get(
      `https://api.telegram.org/bot${process.env.BOT_TOKEN}/getUserProfilePhotos?user_id=${record.telegramId}&limit=1`
    );

    if (photosRes.data.result.total_count > 0) {
      const fileId = photosRes.data.result.photos[0][0].file_id;

      // 2. file_id dan file_path olish
      const fileRes = await axios.get(
        `https://api.telegram.org/bot${process.env.BOT_TOKEN}/getFile?file_id=${fileId}`
      );

      avatar = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${fileRes.data.result.file_path}`;
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
// /profile/:telegramId
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

// /profile (auth bilan)
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

// ================ START SERVER ================
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
