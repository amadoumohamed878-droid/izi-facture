import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const fontSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: "izifacture - SaaS de facturation",
  description: "Logiciel de facturation pour entrepreneurs africains.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={cn("font-sans", fontSans.variable)}>
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
