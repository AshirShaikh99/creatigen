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
          formButtonPrimary:
            "bg-gradient-to-r from-[#6366F1] to-[#A78BFA] text-white hover:opacity-90",
          card: "bg-[#121212] border-[#1E1E1E]",
          headerTitle: "text-[#A78BFA] font-bold",
          headerSubtitle: "text-gray-400",
          socialButtonsBlockButton:
            "bg-[#1A1A1A] border-[#2A2A2A] text-white hover:bg-[#222222]",
          formFieldInput: "bg-[#1A1A1A] border-[#2A2A2A] text-white",
          formFieldLabel: "text-gray-400",
          footer: "bg-[#121212] border-t border-[#1E1E1E] text-gray-400",
          footerText: "text-gray-400",
          footerActionText: "text-gray-400",
          footerActionLink: "text-[#A78BFA] hover:text-[#6366F1]",
          main: "bg-[#121212]",
          logoBox: "hidden",
          dividerLine: "bg-[#1E1E1E]",
          dividerText: "text-gray-500",
          alternativeMethods: "hidden",
          alert: "bg-[#1A1A1A] border-[#2A2A2A] text-gray-400",
          alertText: "text-gray-400",
          profileSectionTitle: "text-gray-400",
          profileSection: "bg-[#121212] border-[#1E1E1E]",
          formFieldAction: "text-[#A78BFA] hover:text-[#6366F1]",
        },
      }}
      // Set session token expiration to 1 hour (3600 seconds)
      sessionOptions={{
        tokenExpiration: 3600,
      }}
    >
      <html lang="en">
        <body
          className={`${inter.className} min-h-screen bg-black text-white antialiased selection:bg-[#A78BFA]/20 selection:text-[#A78BFA]`}
        >
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
