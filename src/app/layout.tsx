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
  title: "CV. Garindo Cab. Palu — Distribusi Sembako & Bahan Bangunan Sulawesi Tengah",
  description:
    "CV. Garindo Cab. Palu, Jl. Sungai Lariang No.23, Ujuna, Kec. Palu Barat, Kota Palu, Sulawesi Tengah 94111. Distributor skala besar komoditas sembako dan material konstruksi dengan jangkauan 13 kabupaten dan kota.",
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