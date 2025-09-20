import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import MUIProvider from "@/components/MUIProvider";

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ["latin"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "Bitrix Dashboard",
  description: "Dashboard для работы с Битрикс24",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${roboto.variable} antialiased`}>
        <MUIProvider>
          {children}
        </MUIProvider>
      </body>
    </html>
  );
}
