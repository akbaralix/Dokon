"use client";
import "./globals.css";
import "./page.css";
import Login from "../components/login/login";
import Home from "../components/home/home";
import Navbar from "../components/navbar/navbar";

function Page() {
  return (
    <div className="page-container">
      <Navbar />
      <Home />
    </div>
  );
}

export default Page;
