import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import { ProvidersAndLayout } from "./ProvidersAndLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Consensus Poker",
  description: "Distributed Poker on SUI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ProvidersAndLayout>{children}</ProvidersAndLayout>
        </ThemeProvider>
        </body>
    </html>
  );
}
