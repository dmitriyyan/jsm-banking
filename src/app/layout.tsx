import type { Metadata } from "next";
import { Inter, IBM_Plex_Serif } from "next/font/google";
import clsx from 'clsx';
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const ibmPlexSerif = IBM_Plex_Serif({ subsets: ["latin"], weight: ['400', '700'], variable: "--font-ibm-plex-serif" });

export const metadata: Metadata = {
  title: "Horizon Bank",
  description: "Horizon Bank is a digital bank that offers a range of financial services.",
  icons: {
    icon: '/icons/logo.svg',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={clsx(inter.variable, ibmPlexSerif.variable)}>{children}</body>
    </html>
  );
}
