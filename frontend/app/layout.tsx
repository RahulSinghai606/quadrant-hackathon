import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

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
    <html lang="en" className="dark">
      <body className="font-body">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1a2234',
              color: '#f3f4f6',
              padding: '16px',
              borderRadius: '12px',
              border: '1px solid #374151',
              boxShadow: '0 8px 40px rgba(0, 0, 0, 0.5)',
            },
            success: {
              iconTheme: {
                primary: '#34d399',
                secondary: '#1a2234',
              },
            },
            error: {
              iconTheme: {
                primary: '#fb7185',
                secondary: '#1a2234',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
