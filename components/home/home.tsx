"use client";

import { useState, useEffect } from "react";
import { GrPrevious, GrNext } from "react-icons/gr";
import { CiHeart } from "react-icons/ci";
import { TbBasketHeart, TbPlus, TbMinus } from "react-icons/tb";
import Recomindation from "../recomindation/recomindation";
import toast from "react-hot-toast";
import "./home.css";

interface Product {
  id: number;
  narx: number;
  title: string;
  rasm: string;
  quantity?: number;
}

function Home() {
  const [mahsulotlar] = useState<Product[]>([
    {
      id: 1,
      narx: 120000,
      title: "Bolalar uchun yangi yil sovgasi...",
      rasm: "https://images.uzum.uz/d4n7oi5v2sjnqk4ke160/t_product_540_high.jpg",
    },
    {
      id: 2,
      narx: 120000,
      title: "Bolalar uchun yangi yil sovgasi...",
      rasm: "https://images.uzum.uz/d4n7oi5v2sjnqk4ke160/t_product_540_high.jpg",
    },
    {
      id: 3,
      narx: 120000,
      title: "Bolalar uchun yangi yil sovgasi...",
      rasm: "https://images.uzum.uz/d4n7oi5v2sjnqk4ke160/t_product_540_high.jpg",
    },
    {
      id: 4,
      narx: 120000,
      title: "Bolalar uchun yangi yil sovgasi...",
      rasm: "https://images.uzum.uz/d4n7oi5v2sjnqk4ke160/t_product_540_high.jpg",
    },
    {
      id: 5,
      narx: 120000,
      title: "Bolalar uchun yangi yil sovgasi...",
      rasm: "https://images.uzum.uz/d4n7oi5v2sjnqk4ke160/t_product_540_high.jpg",
    },
    {
      id: 6,
      narx: 120000,
      title: "Bolalar uchun yangi yil sovgasi...",
      rasm: "https://images.uzum.uz/d4n7oi5v2sjnqk4ke160/t_product_540_high.jpg",
    },
  ]);

  const bannerImg: string[] = [
    "https://images.uzum.uz/d4n0q5uj76olj6nfdlvg/main_page_banner.jpg",
    "https://images.uzum.uz/d4rs90rtqdhgicat6beg/main_page_banner.jpg",
    "https://images.uzum.uz/cvcg2f3vgbkm5ehkika0/main_page_banner.jpg",
  ];

  const [current, setCurrent] = useState<number>(0);

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
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === bannerImg.length - 1 ? 0 : prev + 1));
    }, 8000);
    return () => clearInterval(interval);
  }, [bannerImg.length]);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("mycart", JSON.stringify(cart));
  }, [cart]);

  const toggleFavorite = (product: Product): void => {
    if (favorites.find((item) => item.id === product.id)) {
      setFavorites(favorites.filter((item) => item.id !== product.id));
    } else {
      setFavorites([...favorites, product]);
    }
  };

  const updateQuantity = (product: Product, delta: number): void => {
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      const newQuantity = (existingItem.quantity || 1) + delta;

      if (newQuantity <= 0) {
        setCart(cart.filter((item) => item.id !== product.id));
      } else {
        setCart(
          cart.map((item) =>
            item.id === product.id ? { ...item, quantity: newQuantity } : item,
          ),
        );
      }
    } else if (delta > 0) {
      setCart([...cart, { ...product, quantity: 1 }]);
      toast.success("Mahsulot savatga qo'shildi!");
    }
  };

  return (
    <div>
      <div className="banner-block">
        <div className="banner-navigation">
          <button
            className="slider-button prev"
            onClick={() =>
              setCurrent(current === 0 ? bannerImg.length - 1 : current - 1)
            }
          >
            <GrPrevious />
          </button>
          <button
            className="slider-button next"
            onClick={() =>
              setCurrent(current === bannerImg.length - 1 ? 0 : current + 1)
            }
          >
            <GrNext />
          </button>
        </div>
        <div className="banner-img">
          <img src={bannerImg[current]} alt="Banner" />
        </div>
        <div className="banner-active">
          {bannerImg.map((_, index) => (
            <span
              key={index}
              className={
                "swiper-pagination-bullet " +
                (index === current ? "swiper-pagination-bullet-active" : "")
              }
            ></span>
          ))}
        </div>
      </div>

      <div className="promo-wrapper">
        {[1, 2, 3, 4].map((item) => (
          <div className="promo-item-wrapper" key={item}>
            <img
              src="https://static.uzum.uz/static/promo_images/756b6f56-9d2d-414c-a9d3-37d40d1c808b"
              alt="Promo"
            />
            <span>Onalar va bolalar uchun</span>
          </div>
        ))}
      </div>

      <div className="title-text">
        <h2>Mashhur</h2>
        <span style={{ marginTop: 7, fontSize: 17 }}>
          <GrNext />
        </span>
      </div>

      <div className="products">
        {mahsulotlar.map((m) => {
          const isFav = favorites.some((item) => item.id === m.id);
          const cartItem = cart.find((item) => item.id === m.id);

          return (
            <div className="product-card" key={m.id}>
              <div className="image-wrapper">
                <img src={m.rasm} alt={m.title} />
                <div className="product-card__actions">
                  <button
                    onClick={() => toggleFavorite(m)}
                    style={{ color: isFav ? "red" : "gray" }}
                  >
                    <CiHeart size={24} />
                  </button>
                </div>
              </div>
              <div className="product-card__details">
                <div className="product-card__price">
                  <div className="product-card__title">{m.title}</div>
                  <div className="card-price">
                    <span>{m.narx.toLocaleString()} so'm</span>
                  </div>
                </div>

                <div className="product-card__cart">
                  {cartItem ? (
                    <div className="quantity-controls">
                      <button
                        onClick={() => updateQuantity(m, -1)}
                        className="q-btn"
                      >
                        <TbMinus />
                      </button>
                      <span className="q-num">{cartItem.quantity}</span>
                      <button
                        onClick={() => updateQuantity(m, 1)}
                        className="q-btn"
                      >
                        <TbPlus />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => updateQuantity(m, 1)}
                      className="add-btn"
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
      <div className="title-text">
        <h2>Tavsiya qilamiz</h2>
        <span style={{ marginTop: 7, fontSize: 17 }}>
          <GrNext />
        </span>
      </div>
      <Recomindation />
    </div>
  );
}

export default Home;
