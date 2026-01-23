"use client";
import { useState, useEffect } from "react";
import "./sevimli.css";
import { TbBasketHeart } from "react-icons/tb";
import { CiHeart } from "react-icons/ci";

function Sevimli() {
  const [favorites, setFavorites] = useState([]);

  // LocalStorage dan olish
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(stored);
  }, []);

  // Favoritdan o‘chirish yoki qo‘shish
  const toggleFavorite = (product) => {
    let updated;

    if (favorites.find((item) => item.id === product.id)) {
      updated = favorites.filter((item) => item.id !== product.id);
    } else {
      updated = [...favorites, product];
    }

    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  if (!favorites || favorites.length === 0)
    return (
      <div className="empty-page">
        <img
          className="empty-page_img"
          src="/_Image_1-removebg-preview.png"
          alt=""
        />
        <h1 className="empty-page_title">
          Bu yerda sevimli tovarlaringizni saqlab qoʻyamiz
        </h1>
        <p className="empty-page_text">
          Odatda buyurtma qiladigan yoki keyinroq sotib olishni istagan
          tovarlarda ♡ belgisini bosing
        </p>
      </div>
    );

  return (
    <div className="favorites-products">
      {favorites.map((item) => {
        const isFav = true; // Sevimli sahifada bu mahsulot allaqachon sevimli

        return (
          <div className="product-card_sevimli" key={item.id}>
            <div className="image-wrapper">
              <img src={item.rasm} alt="" />
            </div>

            {/* Yurak tugmasi */}
            <div className="product-card__actions">
              <button
                onClick={() => toggleFavorite(item)}
                style={{ color: isFav ? "red" : "gray" }}
              >
                <CiHeart />
              </button>
            </div>

            <div className="product-card__details">
              <div className="product-card__title">{item.title}</div>
              <div className="product-card__price">
                <span className="card-price">
                  {Number(item.narx).toLocaleString() + " so'm"}
                </span>
              </div>
            </div>

            <button className="card-button">
              <div className="card-button-content">
                <TbBasketHeart />
                <span>Savatga</span>
              </div>
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default Sevimli;
