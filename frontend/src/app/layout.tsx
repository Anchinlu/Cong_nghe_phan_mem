// file: frontend/src/app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header"; // <-- 1. Import Header

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CineBooking Project",
  description: "Hệ thống đặt vé xem phim trực tuyến",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Chúng ta sẽ bỏ class của font Inter để body nhận màu nền từ globals.css */}
      <body>
        <Header /> {/* <-- 2. Thêm Header vào đây */}
        {children} {/* children chính là page.tsx của bạn */}
      </body>
    </html>
  );
}