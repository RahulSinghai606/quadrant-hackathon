import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MediVision AI - Healthcare Intelligence",
  description: "Advanced Healthcare Memory Assistant with Multimodal Medical Intelligence",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#363636',
              padding: '16px',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            },
            success: {
              iconTheme: {
                primary: '#43e97b',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#f5576c',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
