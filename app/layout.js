import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";

import { Providers } from "./providers";
import Header from "./components/Header";
import Footer from "./components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Kerdanet Yvan",
  description: "Coded by Yvan Kerdanet",
};

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const savedTheme = cookieStore.get("theme")?.value;

  const themeClass =
    savedTheme === "dark" ? "dark" : savedTheme === "light" ? "light" : "";

  return (
    <html
      lang="fr"
      className={themeClass}
      suppressHydrationWarning
    >
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Providers>
          {/* Skip to main — WCAG 2.4.1 */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-md focus:bg-accent focus:text-white focus:font-medium"
          >
            Aller au contenu principal
          </a>
          <Header />
          <main id="main-content">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
