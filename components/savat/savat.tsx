"use client";

import { useEffect, useState } from "react";
import { TbBasketHeart, TbPlus, TbMinus, TbTrash } from "react-icons/tb";
import "./savat.css";
import toast from "react-hot-toast";
import { parse } from "path";

interface Product {
  id: number;
  narx: number;
  title: string;
  rasm: string;
  quantity: number;
}

function Savat() {
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem("mycart");
    if (data) {
      setCartItems(JSON.parse(data));
    }
    setLoading(false);
  }, []);
  if (loading) return null;

  const quantityPlus = (item: Product) => {
    const updatedItems = cartItems.map((cartItem) =>
      cartItem.id === item.id
        ? { ...cartItem, quantity: cartItem.quantity + 1 }
        : cartItem,
    );

    setCartItems(updatedItems);
    localStorage.setItem("mycart", JSON.stringify(updatedItems));
  };
  const quantityMinus = (item: Product) => {
    const updatedItems = cartItems
      .map((cartItem) =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem,
      )
      .filter((cartItem) => cartItem.quantity > 0);

    setCartItems(updatedItems);

    if (updatedItems.length === 0) {
      localStorage.removeItem("mycart");
    } else {
      localStorage.setItem("mycart", JSON.stringify(updatedItems));
    }
  };
  const daleteItem = (item: Product) => {
    const updatedItems = cartItems.filter(
      (cartItem) => cartItem.id !== item.id,
    );
    setCartItems(updatedItems);
  };

  const handleCheckout = async () => {
    if (isPending) return;
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Iltimos, avval tizimga kiring!");
      return (window.location.href = "/login");
    }

    setIsPending(true);
    const totalSum = cartItems.reduce(
      (total, item) => total + item.narx * item.quantity,
      0,
    );

    try {
      // 1. BAZAGA SAQLASH (Sizning kodingiz)
      const dbResponse = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/api/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ items: cartItems, totalPrice: totalSum }),
        },
      );

      if (!dbResponse.ok) throw new Error("Buyurtmani saqlashda xatolik!");

      const tgsentToken = "8201270787:AAELpFwtJ7IYefjAIUtxEv39kyuU-jcbo2Y";
      const chatId = "907402803";
      const userData = localStorage.getItem("user");
      const {
        name: username,
        phone: phonenumber,
        id: userId,
      } = userData
        ? JSON.parse(userData)
        : { name: "Noma'lum", phone: "Noma'lum", id: "Noma'lum" };

      const dbResult = await dbResponse.json(); // Bazaga saqlanganda kelgan buyurtma ma'lumoti
      const orderId = dbResult.order._id;

      const itemsList = cartItems
        .map(
          (item) =>
            `📦 ${item.title}\n🔢 ${item.quantity} dona - ${item.narx.toLocaleString()} so'm`,
        )
        .join("\n\n");

      const fullMessage = `🆕 <b>YANGI BUYURTMA</b>\n\n${itemsList}\n\n💰Foydalanuvchi: <a href="tg://user?id=${userId}">${username}</a>\n📞 Telefon: ${phonenumber}\n\n💰 <b>JAMI: ${totalSum.toLocaleString()} so'm</b>`;

      // sendPhoto emas, sendMessage ishlating (chunki rasm Base64 bo'lishi mumkin)
      await fetch(`https://api.telegram.org/bot${tgsentToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: fullMessage,
          parse_mode: "HTML",
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "✅ Tasdiqlash",
                  callback_data: `confirm_${orderId}`,
                },
              ],
              [
                {
                  text: "❌ Bekor qilish",
                  callback_data: `cancel_${orderId}`,
                },
              ],
            ],
          },
        }),
      });

      toast.success("Buyurtmangiz qabul qilindi!");
      localStorage.removeItem("mycart");
      setCartItems([]);
    } catch (error) {
      console.error("Telegram xatosi:", error);
      toast.error("Xatolik yuz berdi!");
    } finally {
      setIsPending(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="savat-holder">
        <img
          src="/empty-cart-3d-icon-png-download-12729855.webp"
          alt="Savat bo'sh"
          className="empty-page_img"
        />
        <h2>Savatda hozircha mahsulot yo'q 😓</h2>
        <p>Hozir haridni boshlash uchun pastdagi tugamani bosing</p>
        <a href="/" className="card-button">
          Bosh sahifa
        </a>
      </div>
    );
  }

  return (
    <div className="savat-container">
      <h1 className="cart-title__header">
        <span>Savatingizda: </span> <span>{cartItems.length} mahsulot</span>
      </h1>
      <div className="cart-container">
        <div className="cart-products-container">
          {cartItems.map((item) => (
            <div className="item__cart-item">
              <div className="cart-item-delivery-info">
                <span>Ertaga yetkazib beramiz</span>
              </div>
              <div className="cart-item-row">
                <div className="cart-item-checkbox">
                  <input type="checkbox" />
                </div>
                <div className="cart-item">
                  <div className="cart-item-wrapper">
                    <div className="image-container">
                      <img src={item.rasm} alt={item.title} />
                    </div>
                  </div>
                  <div className="info-container">
                    <p>{item.title}</p>
                    <span style={{ fontWeight: 700, marginTop: 7 }}>
                      {item.quantity} dona
                    </span>
                    <span className="cart-praduct_price">
                      {(item.quantity * item.narx).toLocaleString()} so'm
                    </span>
                  </div>
                </div>
                <div className="actions-container">
                  <div className="item-amout">
                    <div className="cart-quantity-controls">
                      <button onClick={() => quantityMinus(item)}>
                        <div>
                          <TbMinus />
                        </div>
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => quantityPlus(item)}>
                        <div>
                          <TbPlus />
                        </div>
                      </button>
                    </div>
                  </div>
                  <div className="dalete-acitons">
                    <button onClick={() => daleteItem(item)}>
                      <div>
                        <TbTrash />
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="cart-sum">
          <div className="paid-communication-delivery-info">
            <div className="paid-communication">
              Topshirish punkitigacha bepul yetkazib berish
            </div>
            <div className="cart-summary">
              <div className="summary-heading">Buyurtmangiz</div>
            </div>
            <div className="summary-price-options">
              <div className="text__summary-product">
                Jami mahsulotlar:
                {cartItems.reduce((total, item) => total + item.quantity, 0)}
              </div>
              <div className="summary-price">
                {cartItems
                  .reduce((total, item) => total + item.narx * item.quantity, 0)
                  .toLocaleString()}{" "}
                <span>so'm</span>
              </div>
            </div>
            <div className="summary-actions">
              <button
                onClick={() => handleCheckout()}
                disabled={isPending}
                className={`checkout-btn ${isPending ? "loading" : ""}`}
              >
                {isPending ? (
                  <div className="btn-spinner"></div>
                ) : (
                  "Rasmiylashtirish"
                )}
              </button>{" "}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Savat;
