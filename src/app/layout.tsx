import type React from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import "../styles/scrollbar.css";
import { Providers } from "./providers";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        elements: {
          formButtonPrimary: "bg-[#BBFF45] hover:bg-[#A8E63C] text-black",
          card: "bg-[#121212] border-[#1E1E1E]",
        },
      }}
    >
      <html lang="en">
        <body
          className={`${inter.className} min-h-screen bg-black text-white antialiased selection:bg-[#C1FF00]/20 selection:text-[#C1FF00]`}
        >
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
