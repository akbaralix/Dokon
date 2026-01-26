"use client";

import { useState, useEffect } from "react";
import { GrPrevious, GrNext } from "react-icons/gr";
import { CiHeart } from "react-icons/ci";
import { TbBasketHeart, TbPlus, TbMinus } from "react-icons/tb";
import Recomindation from "../recomindation/recomindation";
import { updateQuantity } from "@/utlis/addcart";
import "./home.css";

// Interface mahsulot modeliga moslangan
interface Product {
  id: string | number; // MongoDB id string bo'ladi
  narx: number;
  title: string;
  rasm: string;
  quantity?: number;
}

function Home() {
  // Statik ma'lumotlar o'rniga bo'sh massiv
  const [mahsulotlar, setMahsulotlar] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const bannerImg: string[] = [
    "https://images.uzum.uz/d4n0q5uj76olj6nfdlvg/main_page_banner.jpg",
    "https://images.uzum.uz/d4rs90rtqdhgicat6beg/main_page_banner.jpg",
    "https://images.uzum.uz/cvcg2f3vgbkm5ehkika0/main_page_banner.jpg",
  ];

  const [current, setCurrent] = useState<number>(0);

  // --- LOCALSTORAGE LOGIKASI ---
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [cart, setCart] = useState<Product[]>([]);

  // 1. Dastlabki yuklash (Baza va LocalStorage)
  useEffect(() => {
    // Bazadan mahsulotlarni olish
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products");
        const data = await res.json();

        console.log("Bazadan kelgan xom ma'lumot:", data);

        const productsArray = data.produts || data.products || [];

        if (Array.isArray(productsArray)) {
          const formattedData = productsArray.map((p: any) => ({
            id: p._id || p.productId || Math.random(),
            title: p.title || "Nomsiz mahsulot",
            narx: p.narx || 0,
            rasm: p.rasm || "",
          }));
          setMahsulotlar(formattedData);
        }
      } catch (error) {
        console.error("Xato yuz berdi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    const storedFavs = localStorage.getItem("favorites");
    const storedCart = localStorage.getItem("mycart");
    if (storedFavs) setFavorites(JSON.parse(storedFavs));
    if (storedCart) setCart(JSON.parse(storedCart));
  }, []);

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

  const bannerNext = () =>
    setCurrent(current === bannerImg.length - 1 ? 0 : current + 1);
  const bannerPrev = () =>
    setCurrent(current === 0 ? bannerImg.length - 1 : current - 1);

  useEffect(() => {
    const interval = setInterval(bannerNext, 8000);
    return () => clearInterval(interval);
  }, [current]);

  return (
    <div>
      <div className="banner-block">
        <div className="banner-navigation">
          <button className="slider-button prev" onClick={bannerPrev}>
            <GrPrevious />
          </button>
          <button className="slider-button next" onClick={bannerNext}>
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
              className={`swiper-pagination-bullet ${index === current ? "swiper-pagination-bullet-active" : ""}`}
            ></span>
          ))}
        </div>
      </div>

      {/* PROMO SECTION */}
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

      {/* PRODUCTS SECTION */}
      <div className="title-text">
        <h2>Mashhur</h2>
        <span style={{ marginTop: 7, fontSize: 17 }}>
          <GrNext />
        </span>
      </div>

      {loading ? (
        <div className="loader-wrapper">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((loader) => (
            <div key={loader} className="loading-state">
              <div className="loading-container">
                <div className="praduct_loader-item"></div>
                <div className="loader_text-item"></div>
                <div className="loader_text-item"></div>
                <div className="loader_button-item"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="products">
          {mahsulotlar.length > 0 ? (
            mahsulotlar.map((m) => {
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
                            onClick={() => updateQuantity(m, -1, cart, setCart)}
                            className="q-btn"
                          >
                            <TbMinus />
                          </button>
                          <span className="q-num">{cartItem.quantity}</span>
                          <button
                            onClick={() => updateQuantity(m, 1, cart, setCart)}
                            className="q-btn"
                          >
                            <TbPlus />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => updateQuantity(m, 1, cart, setCart)}
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
            })
          ) : (
            <div className="error-praduct_message">
              <h3>Mahsulotlar topilmadi</h3>
              <p>Iltimos, keyinroq qayta urinib ko'ring.</p>
              <button onClick={() => window.location.reload()}>
                Qayta yuklash
              </button>
            </div>
          )}
        </div>
      )}

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
