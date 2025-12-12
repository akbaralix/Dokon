const { Telegraf } = require("telegraf");
const mongoose = require("mongoose");
const OTP = require("./OTP");

const bot = new Telegraf("8201270787:AAELpFwtJ7IYefjAIUtxEv39kyuU-jcbo2Y");

// MongoDBga ulanish
mongoose.connect(
  "mongodb+srv://tursunboyevakbarali807_db_user:iFgH6I9m9ehbqvOf@cluster0.38dhsqh.mongodb.net/?appName=Cluster0"
);

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

bot.start(async (ctx) => {
  const chatId = ctx.from.id;
  const otp = generateOTP();

  await OTP.create({
    telegramId: chatId,
    otp,
    expiresAt: Date.now() + 60_000, // 1 daqiqa
  });

  await ctx.reply(`Sizning 1 daqiqalik kodingiz: ${otp}`);
});

bot.launch();
