"use client";

import { useState, useEffect } from "react";
import { TbBasketHeart, TbPlus, TbMinus } from "react-icons/tb";
import { CiHeart } from "react-icons/ci";
import { updateQuantity, Product } from "@/utlis/addcart";
import { toggleFavorite } from "@/utlis/favorite";
import "./recomindation.css";

function Recomindation() {
  const [favorites, setFavorites] = useState<Product[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("favorites");
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  const [cart, setCart] = useState<Product[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("mycart");
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("mycart", JSON.stringify(cart));
  }, [cart]);

  const mahsulotlar: Product[] = [
    {
      id: 1,
      narx: 120000,
      title:
        "Bolalar uchun yangi yil sovgasi. Farzandingiz uchun sovgani hoziroq harid qiling.",
      rasm: "https://images.uzum.uz/d4n7oi5v2sjnqk4ke160/t_product_540_high.jpg",
    },
    {
      id: 2,
      narx: 120000,
      title:
        "Bolalar uchun yangi yil sovgasi. Farzandingiz uchun sovgani hoziroq harid qiling.",
      rasm: "https://images.uzum.uz/d4n7oi5v2sjnqk4ke160/t_product_540_high.jpg",
    },
    {
      id: 3,
      narx: 120000,
      title:
        "Bolalar uchun yangi yil sovgasi. Farzandingiz uchun sovgani hoziroq harid qiling.",
      rasm: "https://images.uzum.uz/d4n7oi5v2sjnqk4ke160/t_product_540_high.jpg",
    },
    {
      id: 4,
      narx: 120000,
      title:
        "Bolalar uchun yangi yil sovgasi. Farzandingiz uchun sovgani hoziroq harid qiling.",
      rasm: "https://images.uzum.uz/d4n7oi5v2sjnqk4ke160/t_product_540_high.jpg",
    },
    {
      id: 5,
      narx: 120000,
      title:
        "Bolalar uchun yangi yil sovgasi. Farzandingiz uchun sovgani hoziroq harid qiling.",
      rasm: "https://images.uzum.uz/d4n7oi5v2sjnqk4ke160/t_product_540_high.jpg",
    },
    {
      id: 6,
      narx: 120000,
      title:
        "Bolalar uchun yangi yil sovgasi. Farzandingiz uchun sovgani hoziroq harid qiling.",
      rasm: "https://images.uzum.uz/d4n7oi5v2sjnqk4ke160/t_product_540_high.jpg",
    },
    {
      id: 7,
      narx: 120000,
      title:
        "Bolalar uchun yangi yil sovgasi. Farzandingiz uchun sovgani hoziroq harid qiling.",
      rasm: "https://images.uzum.uz/d4n7oi5v2sjnqk4ke160/t_product_540_high.jpg",
    },
  ];

  return (
    <div className="recomindation">
      <div className="recom-title">
        <h2>Trentdagi mahsulotlar</h2>
      </div>
      {mahsulotlar.map((item) => {
        const cartItem = cart.find((c) => c.id === item.id);
        const isFav = favorites.some((fav) => fav.id === item.id);

        return (
          <div className="recom-product" key={item.id}>
            <div className="recom-wrapper">
              <img src={item.rasm} alt={item.title} />
              <div className="product-card__actions">
                <button
                  onClick={() => toggleFavorite(item, favorites, setFavorites)}
                  style={{ color: isFav ? "red" : "gray" }}
                >
                  <CiHeart size={24} />
                </button>
              </div>
            </div>
            <div className="product-card__details">
              <div className="product-card__price">
                <span className="card-price">
                  {item.narx.toLocaleString()} so'm
                </span>
              </div>
              <div className="product-card__title">{item.title}</div>
              <div className="product-card__cart">
                {cartItem ? (
                  <div className="quantity-controls">
                    <button
                      onClick={() => updateQuantity(item, -1, cart, setCart)}
                    >
                      <TbMinus />
                    </button>
                    <span>{cartItem.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item, 1, cart, setCart)}
                    >
                      <TbPlus />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => updateQuantity(item, 1, cart, setCart)}
                  >
                    <div className="card-button-content">
                      <TbBasketHeart />
                      <span>Savatga</span>
                    </div>
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Recomindation;
