import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/navbar/navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Anor Market",
  description: "Online dokoni",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Toaster position="top-right" />
        <Navbar />
        <main className="main">{children}</main>
      </body>
    </html>
  );
}
