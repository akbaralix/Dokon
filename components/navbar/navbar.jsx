import { IoSearch } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import "./navbar.css";

function Navbar() {
  return (
    <div>
      <div className="navbar">
        <div className="logo">
          <a href="/">LOGO</a>
        </div>
        <div className="search-header-parts">
          <div className="input-line">
            <input type="text" placeholder="Mahsulotlarni qidirish" />
            <button className="button__search">
              <IoSearch />
            </button>
          </div>
        </div>
        <div className="store-action-buttons">
          <a href="">
            <FaRegUser />
            <span className="store-actions-item">Kirish</span>
          </a>
          <a href="">
            <FaRegHeart />
            <span className="store-actions-item">Saralanganlar</span>
          </a>
          <a href="">
            <FiShoppingCart />
            <span className="store-actions-item">Savat</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
