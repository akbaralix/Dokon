import { useState, useEffect } from "react";
import "./home.css";
import { GrPrevious, GrNext } from "react-icons/gr";
import { CiHeart } from "react-icons/ci";
import { TbBasketHeart } from "react-icons/tb";
import Sevimli from "../sevimli/sevimli";

function Home() {
  const [mahsulotlar, setMasulotlar] = useState([
    {
      id: 1,
      narx: 120000,
      title:
        "Tagliklar Huggies Elite Soft, yangi tug‘ilgan chaqaloqlar uchun 3-5 kg, 1 o‘lcham, 50 dona",
      rasmi:
        "https://images.uzum.uz/d4n7oi5v2sjnqk4ke160/t_product_540_high.jpg",
    },
    {
      id: 2,
      narx: 120000,
      title:
        "Tagliklar Huggies Elite Soft, yangi tug‘ilgan chaqaloqlar uchun 3-5 kg, 1 o‘lcham, 50 dona",
      rasmi:
        "https://images.uzum.uz/d4n7oi5v2sjnqk4ke160/t_product_540_high.jpg",
    },
    {
      id: 3,
      narx: 120000,
      title:
        "Tagliklar Huggies Elite Soft, yangi tug‘ilgan chaqaloqlar uchun 3-5 kg, 1 o‘lcham, 50 dona",
      rasmi:
        "https://images.uzum.uz/d4n7oi5v2sjnqk4ke160/t_product_540_high.jpg",
    },
    {
      id: 4,
      narx: 120000,
      title:
        "Tagliklar Huggies Elite Soft, yangi tug‘ilgan chaqaloqlar uchun 3-5 kg, 1 o‘lcham, 50 dona",
      rasmi:
        "https://images.uzum.uz/d4n7oi5v2sjnqk4ke160/t_product_540_high.jpg",
    },
    {
      id: 5,
      narx: 120000,
      title:
        "Tagliklar Huggies Elite Soft, yangi tug‘ilgan chaqaloqlar uchun 3-5 kg, 1 o‘lcham, 50 dona",
      rasmi:
        "https://images.uzum.uz/d4n7oi5v2sjnqk4ke160/t_product_540_high.jpg",
    },
    {
      id: 6,
      narx: 120000,
      title:
        "Tagliklar Huggies Elite Soft, yangi tug‘ilgan chaqaloqlar uchun 3-5 kg, 1 o‘lcham, 50 dona",
      rasmi:
        "https://images.uzum.uz/d4n7oi5v2sjnqk4ke160/t_product_540_high.jpg",
    },
  ]);
  const bannerImg = [
    "https://images.uzum.uz/d4n0q5uj76olj6nfdlvg/main_page_banner.jpg",
    "https://images.uzum.uz/d4rs90rtqdhgicat6beg/main_page_banner.jpg",
    "https://images.uzum.uz/cvcg2f3vgbkm5ehkika0/main_page_banner.jpg",
  ];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === bannerImg.length - 1 ? 0 : prev + 1));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const [favorites, setFavorites] = useState([]);
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(stored);
  }, []);
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);
  const toggleFavorite = (product) => {
    if (favorites.find((item) => item.id === product.id)) {
      setFavorites(favorites.filter((item) => item.id !== product.id));
    } else {
      setFavorites([...favorites, product]);
    }
  };
  return (
    <div>
      <div className="banner-block">
        <div className="banner-navigation">
          <button
            className="slider-button prev"
            onClick={() => {
              setCurrent(current === 0 ? bannerImg.length - 1 : current - 1);
            }}
          >
            <GrPrevious />
          </button>
          <button
            className="slider-button next"
            onClick={() => {
              setCurrent(current === bannerImg.length - 1 ? 0 : current + 1);
            }}
          >
            <GrNext />
          </button>
        </div>
        <div className="banner-img">
          <img src={bannerImg[current]} alt="" />
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
        <div className="promo-item-wrapper">
          <img
            src="https://static.uzum.uz/static/promo_images/756b6f56-9d2d-414c-a9d3-37d40d1c808b"
            alt=""
          />
          <span>Onalar va bolalar uchun</span>
        </div>
        <div className="promo-item-wrapper">
          <img
            src="https://static.uzum.uz/static/promo_images/756b6f56-9d2d-414c-a9d3-37d40d1c808b"
            alt=""
          />
          <span>Onalar va bolalar uchun</span>
        </div>
        <div className="promo-item-wrapper">
          <img
            src="https://static.uzum.uz/static/promo_images/756b6f56-9d2d-414c-a9d3-37d40d1c808b"
            alt=""
          />
          <span>Onalar va bolalar uchun</span>
        </div>
        <div className="promo-item-wrapper">
          <img
            src="	https://static.uzum.uz/static/promo_images/f23bd39d-326b-459f-8ad4-8ea31d037e73"
            alt=""
          />
          <span>Yangi yil uchun</span>
        </div>
      </div>
      <div className="mashhur">
        <h2> Mashhur</h2>
        <span className="text-lg translate-y-1">
          <GrNext />
        </span>
      </div>
      <div className="products">
        {mahsulotlar.map((m, index) => {
          const isFav = favorites.find((item) => item.id === m.id);
          return (
            <div className="product-card" key={index}>
              <div className="image-wrapper">
                <img src={m.rasmi} alt="" />
                <div className="product-card__actions">
                  <button
                    onClick={() => toggleFavorite(m)}
                    style={{ color: isFav ? "red" : "gray" }}
                  >
                    <CiHeart />
                  </button>
                </div>
              </div>
              <div className="product-card__details">
                <div className="product-card__price">
                  <span className="card-price">{m.narx.toLocaleString()}</span>
                </div>
                <div className="product-card__title">{m.title}</div>
                <div className="product-card__cart">
                  <button>
                    <div className="card-button-content">
                      <TbBasketHeart />
                      <span>Savatga</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Home;
