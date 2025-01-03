import type { Metadata } from "next";
import "./globals.css";
import { Poppins } from "next/font/google";
import { Providers } from "@/app/providers";
import { Toaster } from "react-hot-toast";

const poppins = Poppins({
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "ChatBot Template",
  description: "ChatBot",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark">
      {/* Added viewport meta tag */}
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
      </head>
      <body className={`${poppins.className} antialiased`}>
        {/* Ensuring container with safe overflow */}
        <div className="min-h-screen flex flex-col overflow-hidden">
          <Providers>
            {children}
            {/* Adding Toaster here to enable toast notifications */}
            <Toaster position="top-right" />
          </Providers>
        </div>
      </body>
    </html>
  );
}
