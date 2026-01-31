"use client";
import React, { useState } from "react";
import "./admin.css";
import toast from "react-hot-toast";

function Admin() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Rasmni qayta ishlash funksiyasi (Universal)
  const processFile = (file) => {
    if (file && file.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(file));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Faqat rasm formatidagi fayllarni yuklang!");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    processFile(file);
  };

  // Drag and Drop funksiyalari
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0]; // Sudrab kelingan faylni ushlab olish
    processFile(file);
  };

  const handleSubmit = async () => {
    if (title.length < 50 || title.length > 300) {
      return toast.error(
        "Mahsulot nomi 50 dan kam yoki 300 dan ko‘p bo‘lmasligi kerak!",
      );
    }
    if (!title || !price || !image)
      return toast.error("Hamma maydonlarni to'ldiring!");

    const payload = { title, narx: Number(price), rasm: image };

    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/api/products",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      if (res.ok) {
        toast.success("Mahsulot qo'shildi!");
        setTitle("");
        setPrice("");
        setImage(null);
        setPreview(null);
      }
    } catch (error) {
      console.error("Xato:", error);
    }
  };

  return (
    <div className="admin-page__container">
      <div
        className={`pictures-set__container ${isDragging ? "dragging" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <label htmlFor="file-upload" className="drop-area">
          {preview ? (
            <img src={preview} alt="preview" className="preview-img" />
          ) : (
            <p>Rasmni shu yerga sudrab keling yoki ustiga bosing</p>
          )}
        </label>
        <input
          id="file-upload"
          type="file"
          onChange={handleImageChange}
          style={{ display: "none" }} // Inputni yashiramiz, label orqali ishlaydi
        />
      </div>

      <div className="form-set__container">
        <input
          type="text"
          placeholder="Nomi"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="number"
          placeholder="Narxi"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className={`add-product-btn ${isLoading ? "loading" : ""}`}
        >
          {isLoading ? "Yuklanmoqda..." : "Qo'shish"}
        </button>
      </div>
    </div>
  );
}

export default Admin;
