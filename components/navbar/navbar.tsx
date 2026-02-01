"use client";
import { IoSearch } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { GrHomeRounded } from "react-icons/gr";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Link from "next/link";
import "./navbar.css";

function Navbar() {
  const pathname = usePathname();
  const [isLogged, setIsLogged] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLogged(!!token);
  }, []);

  return (
    <div>
      <div className="navbar">
        <div className="logo">
          <Link href="/">
            <h2
              style={{ fontSize: 30, fontFamily: "poppins", fontWeight: 600 }}
            >
              Logoo
            </h2>
          </Link>
        </div>

        <div className="search-header-parts">
          <div className="input-line">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Mahsulotlarni qidirish"
            />
            <button
              onClick={() => {
                if (!search.trim()) return;
                router.push(`/?search=${search}`);
              }}
              className="button__search"
            >
              <IoSearch />
            </button>
          </div>
        </div>

        <div className="store-action-buttons">
          {isLogged ? (
            <Link href="/profil">
              <FaRegUser />
              <span className="store-actions-item">Profil</span>
            </Link>
          ) : (
            <Link href="/login">
              <FaRegUser />
              <span className="store-actions-item">Kirish</span>
            </Link>
          )}

          <Link href="/sevimli">
            <FaRegHeart />
            <span className="store-actions-item">Sevimli</span>
          </Link>

          <Link href="/savat">
            <FiShoppingCart />
            <span className="store-actions-item">Savat</span>
            <div className="cart-item__quantity">
              <span>{}</span>
            </div>
          </Link>
        </div>
      </div>

      <div className="mobile-menu">
        <Link href="/" className={pathname === "/" ? "active" : ""}>
          <GrHomeRounded />
          <span className="mobile-menu_title">Sahifa</span>
        </Link>

        <Link
          href="/sevimli"
          className={pathname === "/sevimli" ? "active" : ""}
        >
          <FaRegHeart />
          <span className="mobile-menu_title">Sevimli</span>
        </Link>

        <Link href="/savat" className={pathname === "/savat" ? "active" : ""}>
          <FiShoppingCart />
          <span className="mobile-menu_title">Savat</span>
        </Link>

        <Link
          href={isLogged ? "/profil" : "/login"}
          className={pathname === "/profil" ? "active" : ""}
        >
          <FaRegUser />
          <span className="mobile-menu_title">
            {isLogged ? "Profil" : "Kirish"}
          </span>
        </Link>
      </div>
    </div>
  );
}

export default Navbar;
