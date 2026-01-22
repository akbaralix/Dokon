"use client";

import React, { useEffect, useState } from "react";
import "./profil.css";

// Foydalanuvchi ma'lumotlari uchun interfeys
interface User {
  telegramId: number;
  firstName: string;
  lastName: string;
  username: string;
  avatar: string; // null bo'lishi mumkin bo'lsa: string | null
}

// JWT decode qilish uchun helper (Type xavfsizligi bilan)
function parseJwt(token: string): any {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );

    return JSON.parse(jsonPayload);
  } catch (err) {
    console.error("JWT decode xatolik:", err);
    return null;
  }
}

const Profil: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    const payload = parseJwt(token);

    if (!payload || !payload.telegramId) {
      localStorage.removeItem("token"); // Yaroqsiz tokenni o'chirish
      window.location.href = "/login";
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/profile/${payload.telegramId}`,
        );
        if (!res.ok) throw new Error("Profil yuklanmadi");

        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.error("Fetch xatoligi:", err);
        setIsError(true);
      }
    };

    fetchUserProfile();
  }, []);

  // Xatolik yuz berganda
  if (isError) {
    return (
      <div className="error-container">
        <h2>Ma'lumotlarni yuklashda xatolik yuz berdi.</h2>
        <button onClick={() => window.location.reload()}>Qayta urinish</button>
      </div>
    );
  }

  // Loader (Skelet holati)
  if (!user) {
    return (
      <div className="loader-container">
        <div className="loader">
          <div className="avatar-loader"></div>
          <div className="user-title_loader"></div>
        </div>
        <div className="order-continer_loader">
          <div className="order-container_title"></div>
          <div className="order-continer_discription"></div>
          <div className="order-continer_btn"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-profil">
      <div className="profil">
        <div className="useravatar">
          {/* Avatar bo'lmasa standart rasm ko'rsatish */}
          <img
            src={user.avatar || "/default-avatar.png"}
            alt={`${user.firstName} avatar`}
          />
        </div>
        <div className="user-title">
          {user.firstName} {user.lastName}
        </div>
        {user.username && <div className="user-username">@{user.username}</div>}
      </div>

      <div className="orders">
        <div className="order-continer">
          <h2>Hech narsa yo'q</h2>
          <p>
            Sizda faol buyurtma mavjud emas! Barcha kerakli narsalarni topish
            uchun qidirishdan foydalaning!
          </p>
          <a href="/" className="shop-link">
            Xaridni boshlash
          </a>
        </div>
      </div>
    </div>
  );
};

export default Profil;
