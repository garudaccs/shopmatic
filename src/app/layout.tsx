import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CompareProvider } from "@/context/CompareContext";
import CompareBar from "@/components/CompareBar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://shopmatic.cc"),
  title: {
    default: "Shopmatic - Discover the Best Tools & Deals",
    template: "%s | Shopmatic",
  },
  description: "Your trusted source for honest product reviews and exclusive deals on AI tools, software, and digital products. Find the best tools for your business.",
  keywords: ["product reviews", "software reviews", "AI tools", "deals", "discounts", "best tools", "SaaS"],
  authors: [{ name: "Shopmatic" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://shopmatic.cc",
    siteName: "Shopmatic",
    title: "Shopmatic - Discover the Best Tools & Deals",
    description: "Your trusted source for honest product reviews and exclusive deals.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shopmatic - Discover the Best Tools & Deals",
    description: "Your trusted source for honest product reviews and exclusive deals.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Google Analytics 4 Measurement ID (placeholder - replace with actual ID)
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Preconnect to Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen flex flex-col bg-white antialiased">
        <CompareProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CompareBar />
        
          {/* Google Analytics 4 */}
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script
            id="ga-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}', {
                  page_path: window.location.pathname,
                });
              `,
            }}
          />
        </CompareProvider>
      </body>
    </html>
  );
}