"use client";

import React, {
  useState,
  useRef,
  ChangeEvent,
  KeyboardEvent,
  ClipboardEvent,
} from "react";
import { FaTelegram } from "react-icons/fa6";
import toast from "react-hot-toast";
import "./login.css";

// API dan qaytadigan foydalanuvchi ma'lumotlari uchun interface
interface User {
  firstName: string;
  [key: string]: any;
}

interface LoginResponse {
  token: string;
  user: User;
  message?: string;
}

const Login: React.FC = () => {
  const OTP_LENGTH = 6;
  const [values, setValues] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState<boolean>(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  // OTP yuborish funksiyasi
  const submitOTP = async (code: string): Promise<void> => {
    setLoading(true);
    try {
      const res = await fetch("https://anor-market.onrender.com//verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data: LoginResponse = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userName", data.user.firstName); // Ismi
        localStorage.setItem("userPhone", data.user.phone); // Telefon raqami
        toast.success(`Xush kelibsiz, ${data.user.firstName}!`);
        window.location.href = "/profil";
      } else {
        toast.error(data.message || "Kod xato!");
        setValues(Array(OTP_LENGTH).fill(""));
        inputs.current[0]?.focus();
      }
    } catch (err) {
      console.error("Login Error:", err);
      toast.error("Server bilan bog‘lanishda xatolik yuz berdi!");
      setValues(Array(OTP_LENGTH).fill(""));
      inputs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>,
    index: number,
  ): void => {
    const val = e.target.value;
    if (!/^\d?$/.test(val)) return;

    const newValues = [...values];
    newValues[index] = val;
    setValues(newValues);

    // Keyingi inputga o'tish
    if (val && index < OTP_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }

    // Agar hamma kataklar to'lgan bo'lsa, yuborish
    if (newValues.every((v) => v !== "")) {
      submitOTP(newValues.join(""));
    }
  };

  const handleKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    index: number,
  ): void => {
    if (e.key === "Backspace" && values[index] === "" && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>): void => {
    e.preventDefault(); // Standart paste amalini to'xtatamiz
    const pasteData = e.clipboardData
      .getData("Text")
      .trim()
      .slice(0, OTP_LENGTH);
    if (!/^\d+$/.test(pasteData)) return;

    const newValues = [...values];
    pasteData.split("").forEach((char, i) => {
      if (i < OTP_LENGTH) {
        newValues[i] = char;
      }
    });
    setValues(newValues);

    // Oxirgi kiritilgan raqamdan keyingi inputga focus qilish
    const nextIndex = Math.min(pasteData.length, OTP_LENGTH - 1);
    inputs.current[nextIndex]?.focus();

    if (pasteData.length === OTP_LENGTH) {
      submitOTP(pasteData);
    }
  };

  return (
    <div className="login-container">
      <div className="login-title">
        <div className="login-img">
          <img src="/logi-icon-preview.png" alt="" />
        </div>
        <a
          style={{
            color: "#8f7de2ff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            marginBottom: 8,
          }}
          href="https://t.me/Onlayndokonibot"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaTelegram /> @Onlayndokonibot
        </a>
        <span>Telegram botga kiring va 1 daqiqada kodingizni oling</span>
      </div>

      <div className="input-group">
        {values.map((val, index) => (
          <input
            key={index}
            type="tel"
            maxLength={1}
            ref={(el) => {
              inputs.current[index] = el;
            }}
            value={val}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            disabled={loading}
            autoComplete="one-time-code"
          />
        ))}
      </div>
      {loading && <div className="login-loader"></div>}
    </div>
  );
};

export default Login;
