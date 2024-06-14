import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import { ProvidersAndLayout } from "../ProvidersAndLayout";


const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <ProvidersAndLayout>{children}</ProvidersAndLayout>
  );
}
