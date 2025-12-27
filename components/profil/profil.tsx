"use client";
import React, { useEffect, useState } from "react";
import "./profil.css";
interface User {
  telegramId: number;
  firstName: string;
  lastName: string;
  username: string;
  avatar: string | null;
}
// JWT decode qilish uchun helper
function parseJwt(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (err) {
    console.error("JWT decode xatolik:", err);
    return null;
  }
}

const Profil = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const payload = parseJwt(token);
    if (!payload || !payload.telegramId) {
      window.location.href = "/login";
      return;
    }

    const telegramId = payload.telegramId;
    if (!telegramId) return;

    fetch(`https://market-vn26.onrender.com/profile/${telegramId}`)
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch((err) => console.error(err));
  }, []);

  if (!user)
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

  return (
    <div className="user-profil">
      <div className="profil">
        <div className="useravatar">
          <img src={user.avatar} alt="" />
        </div>
        <div className="user-title">{user.firstName}</div>
      </div>
      <div className="orders">
        <div className="order-continer">
          <h2>Hech narsa yo'q</h2>
          <p>
            Sizda faol buyurtma mavjud emas! Barcha kerakli narsalarni topish
            uchun qidirishdan foydalaning!
          </p>
          <a href="/">Xaridni boshlash</a>
        </div>
      </div>
    </div>
  );
};

export default Profil;
