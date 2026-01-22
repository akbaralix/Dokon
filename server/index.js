import { Telegraf, Markup } from "telegraf";
import mongoose from "mongoose";
import OTP from "./OTP.js";
import User from "./user.js";

const bot = new Telegraf("8201270787:AAELpFwtJ7IYefjAIUtxEv39kyuU-jcbo2Y");

// MongoDB ulanishi
const MONGO_URI =
  "mongodb+srv://tursunboyevakbarali807_db_user:iFgH6I9m9ehbqvOf@cluster0.38dhsqh.mongodb.net/?appName=Cluster0";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB-ga ulanish muvaffaqiyatli!"))
  .catch((err) => console.error("❌ MongoDB-ga ulanishda xato:", err));

// Bot start buyrug'i
bot.start(async (ctx) => {
  await ctx.reply(
    `Salom ${ctx.from.first_name}! Tizimga kirish uchun telefon raqamingizni yuboring:`,
    Markup.keyboard([
      [Markup.button.contactRequest("📱 Telefon raqamni yuborish")],
    ])
      .resize()
      .oneTime(),
  );
});

// Kontakt kelganda ishlovchi qism
bot.on("contact", async (ctx) => {
  try {
    const contact = ctx.message.contact;
    const chatId = ctx.from.id;

    // Faqat o'zining raqamini yuborganini tekshirish
    if (contact.user_id !== chatId) {
      return ctx.reply("Iltimos, faqat o'zingizning raqamingizni yuboring!");
    }

    // Baza ulanishini tekshirish (0-disconnected, 1-connected, 2-connecting)
    if (mongoose.connection.readyState !== 1) {
      return ctx.reply(
        "Hozirda baza bilan ulanish mavjud emas. Bir ozdan so'ng qayta urinib ko'ring.",
      );
    }

    // Foydalanuvchini bazada saqlash yoki yangilash
    await User.findOneAndUpdate(
      { telegramId: chatId },
      {
        phone: contact.phone_number,
        firstName: contact.first_name,
        lastName: contact.last_name || "",
        username: ctx.from.username || "",
      },
      { upsert: true, new: true },
    );

    // OTP yaratish
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await OTP.deleteOne({ telegramId: chatId }); // Eski OTPni o'chirish

    await OTP.create({
      telegramId: chatId,
      otp,
      expiresAt: Date.now() + 300000, // 5 daqiqa
    });

    await ctx.reply(
      `Sizning tasdiqlash kodingiz: \`${otp}\``,
      {
        parse_mode: "Markdown",
      },

      Markup.removeKeyboard(),
    );
  } catch (error) {
    console.error("Xatolik yuz berdi:", error);
    await ctx.reply(
      "Tizimda xatolik yuz berdi. Iltimos keyinroq urinib ko'ring.",
    );
  }
});

bot.launch();
