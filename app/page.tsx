"use client";
import "./globals.css";
import "./page.css";
import Home from "../components/home/home";
import Navbar from "../components/navbar/navbar";
import Sevimli from "../components/sevimli/sevimli";
import Login from "../components/login/login";

function Page() {
  return (
    <div className="page-container">
      <Home />
    </div>
  );
}

export default Page;
