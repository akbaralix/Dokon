"use client";
import { useState, useEffect } from "react";
import { TbBasketHeart, TbPlus, TbMinus } from "react-icons/tb";
import { CiHeart } from "react-icons/ci";
import { updateQuantity } from "@/utlis/addcart"; // Yo'l to'g'riligini tekshiring
import "./sevimli.css";
import "../home/home.css";

// Mahsulot turi (Interface)
interface Product {
  id: string | number;
  title: string;
  rasm: string;
  narx: number;
  quantity?: number;
}

function Sevimli() {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [cart, setCart] = useState<Product[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // 1. LocalStorage dan ma'lumotlarni yuklash (Faqat Client-side da)
  useEffect(() => {
    const storedFavs = localStorage.getItem("favorites");
    const storedCart = localStorage.getItem("mycart");

    if (storedFavs) setFavorites(JSON.parse(storedFavs));
    if (storedCart) setCart(JSON.parse(storedCart));

    setIsLoaded(true); // Gidratatsiya xatosini oldini olish uchun
  }, []);

  // 2. Savat o'zgarganda LocalStorage-ni yangilash
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("mycart", JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  // Favoritdan o‘chirish
  const toggleFavorite = (product: Product) => {
    const updated = favorites.filter((item) => item.id !== product.id);
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  // Agar sahifa hali yuklanmagan bo'lsa (SSR uchun)
  if (!isLoaded) return null;

  // Bo'sh holat
  if (favorites.length === 0) {
    return (
      <div className="empty-page">
        <img
          className="empty-page_img"
          src="/_Image_1-removebg-preview.png"
          alt="Bo'sh"
        />
        <h1 className="empty-page_title">
          Bu yerda sevimli tovarlaringiz saqlanadi
        </h1>
        <p className="empty-page_text">
          Odatda buyurtma qiladigan tovarlarda ♡ belgisini bosing
        </p>
      </div>
    );
  }

  return (
    <div className="favorites-products">
      {favorites.map((item) => {
        // Savatda bor yoki yo'qligini tekshirish
        const cartItem = cart.find((c) => c.id === item.id);

        return (
          <div className="product-card_sevimli" key={item.id}>
            <div className="image-wrapper">
              <img src={item.rasm} alt={item.title} />
            </div>

            <div className="product-card__actions">
              <button
                onClick={() => toggleFavorite(item)}
                style={{ color: "red" }}
              >
                <CiHeart size={25} />
              </button>
            </div>

            <div className="product-card__details">
              <div className="product-card__title">{item.title}</div>
              <div className="product-card__price">
                <span className="card-price">
                  {Number(item.narx).toLocaleString()} so'm
                </span>
              </div>
            </div>

            <div className="product-card__cart">
              {cartItem ? (
                <div className="quantity-controls">
                  <button
                    onClick={() => updateQuantity(item, -1, cart, setCart)}
                    className="q-btn"
                  >
                    <TbMinus />
                  </button>
                  <span className="q-num">{cartItem.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item, 1, cart, setCart)}
                    className="q-btn"
                  >
                    <TbPlus />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => updateQuantity(item, 1, cart, setCart)}
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
        );
      })}
    </div>
  );
}

export default Sevimli;
