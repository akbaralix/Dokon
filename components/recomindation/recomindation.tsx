"use client";

import { TbBasketHeart } from "react-icons/tb";
import { CiHeart } from "react-icons/ci";
import updateQuantity from "../home/home";
import "./recomindation.css";
// import mahsulotlar from "../../praduct"

function recomindation() {
  const mahsulotlar = [
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
  ];

  return (
    <div className="recomindation">
      <div className="recom-title">
        <h2>Salom</h2>
      </div>
      {mahsulotlar.map((item) => (
        <div className="recom-product" key={item.id}>
          <div className="recom-wrapper">
            <img src={item.rasm} alt={item.title} />
            <div className="product-card__actions">
              <button>
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
              <button onClick={() => updateQuantity()}>
                <div className="card-button-content">
                  <TbBasketHeart />
                  <span>Savatga</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default recomindation;
