import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ProDriver Mod APK Shop",
  description: "ร้านค้าสินค้า Mod APK คุณภาพสูง",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
