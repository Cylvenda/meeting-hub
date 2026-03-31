import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

// Configure Poppins
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "700"], // optional: 400=regular, 500=medium, 700=bold
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Meeting Hub",
    template: "%s | Meeting Hub",
  },
  description: "Secure web-based virtual meeting system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("h-full antialiased", poppins.variable)}>
      <body className="min-h-screen bg-background font-sans">
        {children}
      </body>
    </html>
  );
}