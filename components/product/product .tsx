"use client";

import { useState, useEffect } from "react";
import { TbBasketHeart, TbPlus, TbMinus } from "react-icons/tb";
import { updateQuantity } from "@/utlis/addcart";
import router from "next/router";
import "./product.css";

interface ProductType {
  id: string | number;
  narx: number;
  title: string;
  rasm: string;
  description?: string;
  quantity?: number;
}

export default function ProductPage({ id }: { id: string }) {
  const [data, setData] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<ProductType[]>([]);

  // LocalStorage va API ma'lumotlarini yuklash
  useEffect(() => {
    const storedCart = localStorage.getItem("mycart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }

    const fetchProduct = async () => {
      try {
        const res = await fetch(
          process.env.NEXT_PUBLIC_API_URL + "/api/products",
        );
        const result = await res.json();
        const productsArray = result.produts || result.products || [];

        // Home dagi kabi ID mantiqi
        const found = productsArray.find(
          (p: any) => String(p._id || p.productId) === String(id),
        );

        if (found) {
          setData({
            id: found._id || found.productId,
            title: found.title || "Nomsiz mahsulot",
            narx: found.narx || 0,
            rasm: found.rasm || "",
            description: found.description,
          });
        }
      } catch (e) {
        console.error("Xatolik:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Savat o'zgarganda localga yozish
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("mycart", JSON.stringify(cart));
    }
  }, [cart, loading]);

  // Savatda borligini tekshirish (data yuklangandan so'ng)
  const cartItem = data
    ? cart.find((item) => String(item.id) === String(data.id))
    : null;

  if (loading) return <div className="p-loader">Yuklanmoqda...</div>;
  if (!data) return <div className="p-error">Mahsulot topilmadi</div>;

  return (
    <div className="p-dark-theme">
      <div className="p-container">
        <div className="p-main-grid">
          {/* Rasm qismi */}
          <div className="p-image-wrapper">
            <img src={data.rasm} alt={data.title} className="p-main-img" />
          </div>

          {/* Ma'lumot qismi */}
          <div className="p-details-wrapper">
            <h1 className="p-product-title">{data.title}</h1>

            <div className="p-sticky-card">
              <div className="p-price-row">
                <span className="p-price-current">
                  {data.narx.toLocaleString()} so'm
                </span>
                <span className="p-price-old">
                  {(data.narx * 1.2).toLocaleString()} so'm
                </span>
              </div>
              <div className="p-delivery-tag">Yetkazib berish: 1 kunda</div>
              <div className="p-action-area">
                {cartItem ? (
                  <div className="praduct-card__actions">
                    <div className="p-qty-box">
                      <button
                        className="p-qty-btn"
                        onClick={() => updateQuantity(data, -1, cart, setCart)}
                      >
                        <TbMinus size={20} />
                      </button>
                      <span className="p-qty-val">{cartItem.quantity}</span>
                      <button
                        className="p-qty-btn"
                        onClick={() => updateQuantity(data, 1, cart, setCart)}
                      >
                        <TbPlus size={20} />
                      </button>
                    </div>
                    <button
                      className="cart-added_btn"
                      onClick={() => router.push("/savat")}
                    >
                      Savatga o'tish
                    </button>
                  </div>
                ) : (
                  <button
                    className="p-buy-btn"
                    onClick={() => updateQuantity(data, 1, cart, setCart)}
                  >
                    <TbBasketHeart size={24} />
                    <span>Savatga qo'shish</span>
                  </button>
                )}
              </div>
            </div>

            <div className="p-info-text">
              <h3>Mahsulot tavsifi</h3>
              <p>
                {data.description ||
                  "Ushbu mahsulot haqida batafsil ma'lumot tez orada qo'shiladi."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
