"use client";

import React, { useEffect, useState } from "react";
import "./profil.css";
import toast from "react-hot-toast";

const Profil: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/login";
        return;
      }

      try {
        const [userRes, ordersRes] = await Promise.all([
          fetch("http://localhost:5000/profile", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:5000/api/my-orders", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const userData = await userRes.json();
        const ordersData = await ordersRes.json();

        setUser(userData.user);
        setOrders(ordersData.orders || []);
      } catch (err) {
        toast.error("Ma'lumotlarni yuklashda xatolik!");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCancelOrder = async (orderId: string) => {
    if (
      !confirm(
        "Buyurtmani bekor qilsangiz u bazadan butunlay o'chib ketadi. Rozimisiz?",
      )
    )
      return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Buyurtma o'chirildi");
        // Statendan darhol o'chirish
        setOrders((prev) => prev.filter((o) => o._id !== orderId));
      } else {
        toast.error(data.message || "O'chirishda xatolik");
      }
    } catch (err) {
      toast.error("Server bilan aloqa yo'q");
    }
  };

  if (loading) {
    return (
      <div className="loader-container dark-mode">
        <div className="loader">
          <div className="avatar-loader skeleton"></div>
          <div className="user-title_loader skeleton"></div>
        </div>
        <div className="order-continer_loader">
          <div className="skeleton order-card-loader"></div>
        </div>
      </div>
    );
  }
  if (!user) {
    return (
      <div className="error-container">
        <img src="error.png" alt="" />
        <h2>Ma'lumotlarni yuklashda xatolik!</h2>
        <p>
          Server bilan ulanib bolmadi qayta urinib koring yoki keyinroq qayta
          uruning
        </p>
        <button onClick={() => window.location.reload()}>Qayta yuklash</button>
      </div>
    );
  }

  return (
    <div className="user-profil dark-mode">
      <div className="profil">
        <div className="useravatar">
          <img src={user?.avatar || "/devault-avatar.jpg"} alt="avatar" />
        </div>
        <div className="user-info">
          <div className="user-title">
            {user?.firstName} {user?.lastName}
          </div>
          {user?.username && (
            <div className="user-username">@{user.username}</div>
          )}
        </div>
      </div>

      <div className="orders-section">
        <h3 className="section-title">Buyurtmalarim: {orders.length} ta</h3>

        {orders.length === 0 ? (
          <div className="order-continer empty-state">
            <h2>Hozircha buyurtmalar yo'q</h2>
            <a href="/" className="shop-link">
              Asosiy sahifa
            </a>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-card shadow-card">
                <div className="order-header">
                  <div className="order-id">ID {order._id.slice(-6)}</div>
                  <div className={`status-badge ${order.status}`}>
                    {order.status}
                  </div>
                </div>

                <div className="order-body">
                  {order.items.map((item: any, idx: number) => (
                    <div key={idx} className="order-item">
                      <span>{item.title}</span>
                      <span>{item.quantity} dona</span>
                    </div>
                  ))}
                </div>

                <div className="order-footer">
                  <div className="total-info">
                    <span style={{ fontSize: 20 }}>Jami:</span>
                    <span className="total-amount">
                      {(order.totalAmount || 0).toLocaleString()} so'm
                    </span>
                  </div>
                  <button
                    onClick={() => handleCancelOrder(order._id)}
                    className="cancel-btn"
                  >
                    Bekor qilish
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profil;
