import type { Metadata, Viewport } from "next";
import { Outfit, Montserrat } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CV. Garindo — Distribusi Sembako & Bahan Bangunan Sulawesi Tengah",
  description:
    "Pilar utama rantai pasok Sulawesi Tengah. Distributor skala besar komoditas sembako dan material konstruksi di Palu dengan jangkauan 13 kabupaten dan kota.",
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${outfit.variable} ${montserrat.variable} antialiased`}
    >
      <body
        suppressHydrationWarning
        className="bg-black text-[#1D1D1F] font-sans min-h-screen"
      >
        {children}
      </body>
    </html>
  );
}