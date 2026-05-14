import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
    url: "https://shopmatic.com",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Google Analytics placeholder */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'GA_MEASUREMENT_ID');
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-white antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}