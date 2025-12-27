"use client";
import React, { useState, useRef } from "react";
import { FaTelegram } from "react-icons/fa6";
import toast from "react-hot-toast";
import "./login.css";

function Login() {
  const OTP_LENGTH = 6;
  const [values, setValues] = useState(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const val = e.target.value;
    if (!/^\d?$/.test(val)) return;

    const newValues = [...values];
    newValues[index] = val;
    setValues(newValues);

    if (val && index < OTP_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }

    if (newValues.every((v) => v !== "")) {
      submitOTP(newValues.join(""));
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && values[index] === "" && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasteData = e.clipboardData.getData("Text").slice(0, OTP_LENGTH);
    if (!/^\d+$/.test(pasteData)) return;

    const newValues = [...values];
    for (let i = 0; i < pasteData.length; i++) {
      newValues[i] = pasteData[i];
      if (inputs.current[i]) inputs.current[i]!.value = pasteData[i];
    }
    setValues(newValues);

    const lastIndex = pasteData.length - 1;
    if (lastIndex >= 0 && lastIndex < OTP_LENGTH) {
      inputs.current[lastIndex]?.focus();
    }

    if (pasteData.length === OTP_LENGTH) {
      submitOTP(pasteData);
    }
  };

  const submitOTP = async (code: string) => {
    setLoading(true);
    try {
      const res = await fetch("https://market-vn26.onrender.com/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();

      if (res.ok) {
        console.log("Login success:", data.user);
        localStorage.setItem("token", data.token);
        toast.success(`Xush kelibsiz, ${data.user.firstName}!`);
        window.location.href = "/profil";
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      setValues(Array(OTP_LENGTH).fill(""));
      inputs.current[0]?.focus();
      toast.error("Server bilan bog‘lanishda xatolik yuz berdi!");
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-title">
        <a
          style={{
            color: "#8f7de2ff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
          }}
          href="https://t.me/Onlayndokonibot"
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
            ref={(el) => (inputs.current[index] = el)}
            value={val}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            disabled={loading}
          />
        ))}
      </div>
      {loading && <p className="login-loader">Tekshirilmoqda...</p>}
    </div>
  );
}

export default Login;
