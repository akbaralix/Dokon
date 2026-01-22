"use client";

import { useEffect, useState } from "react";
import { TbBasketHeart, TbPlus, TbMinus, TbTrash } from "react-icons/tb";
import "./savat.css";

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

  useEffect(() => {
    const data = localStorage.getItem("mycart");
    if (data) {
      setCartItems(JSON.parse(data));
    }
    setLoading(false);
  }, []);

  const quantityPlus = (item: Product) => () => {
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
  if (loading) return null;

  if (cartItems.length === 0) {
    return (
      <div className="savat-holder">
        <img
          src="/empty-cart-3d-icon-png-download-12729855.webp"
          alt="Savat bo'sh"
          className="empty-page_img"
        />
        <h2>Savatda hozircha mahsulot yo'q</h2>
        <p>Bosh sahifadagi mahsulotlar kombinatsiyasidan boshlang</p>
        <a href="/" className="card-button">
          Bosh sahifa
        </a>
      </div>
    );
  }

  return (
    <div className="savat-container">
      <h1>
        <span>Savatingiz, </span> <span>{cartItems.length} mahsulot</span>
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
                    <span>{item.quantity} dona</span>
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
              <div className="text__summary-product">Mahsulotlar: {2}</div>
              <div className="summary-price">
                {cartItems
                  .reduce((total, item) => total + item.narx * item.quantity, 0)
                  .toLocaleString()}{" "}
                <span>so'm</span>
              </div>
            </div>
            <div className="summary-actions">
              <button>Rasmiylashtirish</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Savat;
