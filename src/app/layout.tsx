import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import Providers from "./providers";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Prism Memory - AI Powered Album Service",
  description: "AI가 분석하는 스마트 앨범 서비스로 당신의 소중한 추억을 더욱 특별하게 만들어보세요.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
