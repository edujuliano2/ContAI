import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const font = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "ContAI - Gestão de Finanças Pessoais",
  description: "Gerencie suas finanças pessoais e familiares de forma simples e eficiente",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${font.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#0F0F0F]">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
