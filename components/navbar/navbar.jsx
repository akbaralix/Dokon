"use client";
import { IoSearch } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { GrHomeRounded } from "react-icons/gr";
import { usePathname } from "next/navigation";

import Link from "next/link";
import "./navbar.css";

function Navbar() {
  const pathname = usePathname();
  return (
    <div>
      <div className="navbar">
        <div className="logo">
          <Link href="/">LOGO</Link>
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
          <Link href="/login">
            <FaRegUser />
            <span className="store-actions-item">Kirish</span>
          </Link>

          <Link href="/sevimli">
            <FaRegHeart />
            <span className="store-actions-item">Saralanganlar</span>
          </Link>

          <Link href="/savat">
            <FiShoppingCart />
            <span className="store-actions-item">Savat</span>
          </Link>
        </div>
      </div>

      <div className="mobile-menu">
        <Link href="/" className={pathname === "/" ? "active" : ""}>
          <GrHomeRounded />
          <span className="mobile-menu_title">Bosh sahifa</span>
        </Link>
        <Link
          href="/sevimli"
          className={pathname === "/sevimli" ? "active" : ""}
        >
          <IoSearch />
          <span className="mobile-menu_title">Qidirish</span>
        </Link>
        <Link
          href="/sevimli"
          className={pathname === "/sevimli" ? "active" : ""}
        >
          <FaRegHeart />
          <span className="mobile-menu_title">Saralanganlar</span>
        </Link>
        <Link href="/savat" className={pathname === "/sevimli" ? "active" : ""}>
          <FiShoppingCart />
          <span className="mobile-menu_title">Savat</span>
        </Link>
        <Link
          href="/sevimli"
          className={pathname === "/sevimli" ? "active" : ""}
        >
          <FaRegUser />
          <span className="mobile-menu_title">Profil</span>
        </Link>
      </div>
    </div>
  );
}

export default Navbar;
