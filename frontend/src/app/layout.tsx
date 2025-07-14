// frontend/src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header"; 
import Footer from "@/components/Footer";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: "CineBooking Project",
  description: "Hệ thống đặt vé xem phim trực tuyến",
};

export default function RootLayout({ children }: { children: React.ReactNode; }) {
  return (
    <html lang="en">
      <body className="bg-black flex flex-col min-h-screen">
        <AuthProvider>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}