import { Telegraf, Markup } from "telegraf";
import mongoose from "mongoose";
import OTP from "./OTP.js";
import User from "./models/user.js";
import Order from "./models/order.js"; // Buyurtma modelini qo'shdik

const bot = new Telegraf("8201270787:AAELpFwtJ7IYefjAIUtxEv39kyuU-jcbo2Y");

// MongoDB ulanishi
const MONGO_URI =
  "mongodb+srv://tursunboyevakbarali807_db_user:iFgH6I9m9ehbqvOf@cluster0.38dhsqh.mongodb.net/?appName=Cluster0";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB-ga ulanish muvaffaqiyatli!"))
  .catch((err) => console.error("❌ MongoDB-ga ulanishda xato:", err));

// --- 1. START BUYRUG'I ---
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

// --- 2. KONTAKT VA OTP QISMI ---
bot.on("contact", async (ctx) => {
  try {
    const contact = ctx.message.contact;
    const chatId = ctx.from.id;

    if (contact.user_id !== chatId) {
      return ctx.reply("Iltimos, faqat o'zingizning raqamingizni yuboring!");
    }

    if (mongoose.connection.readyState !== 1) {
      return ctx.reply("Hozirda baza bilan ulanish mavjud emas.");
    }

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

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await OTP.deleteOne({ telegramId: chatId });

    await OTP.create({
      telegramId: chatId,
      otp,
      expiresAt: Date.now() + 300000,
    });

    await ctx.reply(
      `Sizning tasdiqlash kodingiz: \`${otp}\``,
      { parse_mode: "Markdown" },
      Markup.removeKeyboard(),
    );
  } catch (error) {
    console.error("Xatolik:", error);
    await ctx.reply("Tizimda xatolik yuz berdi.");
  }
});

// --- 3. BUYURTMANI TASDIQLASH/BEKOR QILISH (Yangi qo'shildi) ---
bot.on("callback_query", async (ctx) => {
  try {
    const data = ctx.callbackQuery.data;
    const [action, orderId] = data.split("_");

    if (!orderId) return ctx.answerCbQuery("ID topilmadi!");

    if (action === "confirm") {
      // Bazada statusni o'zgartirish
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { status: "tasdiqlandi" },
        { new: true },
      );

      if (!updatedOrder) return ctx.answerCbQuery("Buyurtma topilmadi!");

      // Telegramdagi xabarni yangilash (Tugmalarni o'chirish)
      await ctx.editMessageText(
        `${ctx.callbackQuery.message.text}\n\n✅ **HOLAT: TASDIQLANDI**`,
        { parse_mode: "Markdown" },
      );

      await ctx.answerCbQuery("Buyurtma tasdiqlandi!");
    } else if (action === "cancel") {
      await Order.findByIdAndUpdate(orderId, { status: "bekor qilindi" });

      await ctx.editMessageText(
        `${ctx.callbackQuery.message.text}\n\n❌ **HOLAT: BEKOR QILINDI**`,
        { parse_mode: "Markdown" },
      );

      await ctx.answerCbQuery("Buyurtma bekor qilindi.");
    }
  } catch (error) {
    console.error("Callback xatosi:", error);
    await ctx.answerCbQuery("Xatolik yuz berdi.");
  }
});

// --- 4. BOTNI ISHGA TUSHIRISH ---
bot.launch().then(() => console.log("🤖 Bot muvaffaqiyatli ishga tushdi!"));

// Graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
