import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { UserProvider } from "@/contexts/UserContext";
import Footer from '@/components/Footer';
import { CustomPostHogProvider } from '@/components/CustomPostHogProvider';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "brokedash",
  description: "Compare your food spending anonymously",
  icons: [
    { rel: "icon", url: "/favicon.ico" },
    { rel: "apple-touch-icon", sizes: "180x180", url: "/apple-touch-icon.png" },
    { rel: "icon", type: "image/png", sizes: "32x32", url: "/favicon-32x32.png" },
    { rel: "icon", type: "image/png", sizes: "16x16", url: "/favicon-16x16.png" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <CustomPostHogProvider>
          <UserProvider>
            <div className="landing-page">
              <Navbar />
              <main className="landing-content">{children}</main>
              <div className="footer-wrapper">
                <Footer />
              </div>
            </div>
          </UserProvider>
        </CustomPostHogProvider>
      </body>
    </html>
  );
}
