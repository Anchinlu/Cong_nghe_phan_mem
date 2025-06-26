// file: frontend/src/app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header"; // <-- 1. Import Header
import Footer from "@/components/Footer";

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
      {/* Thêm các class này vào thẻ body */}
      <body className="bg-black flex flex-col min-h-screen">
        <Header />

        {/* Bọc children trong một thẻ main để nó tự co dãn */}
        <main className="flex-grow">
          {children}
        </main>

        <Footer /> {/* <-- 2. Thêm Footer vào đây */}
      </body>
    </html>
  );
}