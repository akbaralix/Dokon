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
        "Xiaomi Redmi 15C smartfon, 6.9&quot; IPS 120 Hz, 50 Mp, 6000 mA·soat, 33 Vt",
      rasm: "https://images.uzum.uz/d5o8lreojia393msojh0/t_product_540_high.jpg",
    },
    {
      id: 2,
      narx: 120000,
      title:
        "Simsiz quloqchinlar CANYON TWS OnGo 4 Mini, bluetooth quloqchin, vakuumli.",
      rasm: "https://images.uzum.uz/ct9dgkui4n3ehka2ivj0/t_product_540_high.jpg",
    },
    {
      id: 3,
      narx: 120000,
      title:
        "Simsiz quloqchinlar Canyon OnRiff 6 ANC, katta to‘liq o‘lchamli naushniklar",
      rasm: "https://images.uzum.uz/d2dis1niub33ceg94jig/t_product_540_high.jpg",
    },
    {
      id: 4,
      narx: 149000,
      title:
        "Simsiz o'yin sichqonchasi T-Wolf X8, geymerlar uchun mishka, ovozsiz sichqoncha, 2400 DPI - ",
      rasm: "https://images.uzum.uz/d4gfcvlv2sjnqk4i7tb0/t_product_540_high.jpg",
    },
    {
      id: 5,
      narx: 29000000,
      title: "Noutbuk Adreamer LeoBook 13.3 2.5K UHD - .",
      rasm: "https://images.uzum.uz/d2lv9t52llnd6juivan0/t_product_540_high.jpg",
    },
    {
      id: 6,
      narx: 3400000,
      title:
        "Smartfon Honor X9C, AMOLED 120 Hz, 108 MP kamera, 12/256GB, 6600 mA/soat, 66 Vt - Smartfonlari",
      rasm: "https://images.uzum.uz/d3287pb4eu2up0au55ng/t_product_540_high.jpg",
    },
    {
      id: 7,
      narx: 120000,
      title: "Mini smartfon, sensorli telefon, Android 12, xotirasi 2/16 Gb",
      rasm: "https://images.uzum.uz/d3ia0j6f4hvrfnknp5a0/t_product_540_high.jpg",
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
          <a href={`/product/${item.id}`} key={item.id}>
            <div className="recom-product" key={item.id}>
              <div className="recom-wrapper">
                <img src={item.rasm} alt={item.title} />
                <div className="product-card__actions">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleFavorite(item, favorites, setFavorites);
                    }}
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
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          updateQuantity(item, -1, cart, setCart);
                        }}
                      >
                        <TbMinus />
                      </button>
                      <span>{cartItem.quantity}</span>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          updateQuantity(item, 1, cart, setCart);
                        }}
                      >
                        <TbPlus />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        updateQuantity(item, 1, cart, setCart);
                      }}
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
          </a>
        );
      })}
    </div>
  );
}

export default Recomindation;
