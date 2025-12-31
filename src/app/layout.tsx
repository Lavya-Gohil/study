import type { Metadata } from "next";
import { DM_Mono, Playfair_Display, Sora } from "next/font/google";
import SessionProvider from "@/components/SessionProvider";
import PageTransition from "@/components/PageTransition";
import CursorSpotlight from "@/components/CursorSpotlight";
import TileMotion from "@/components/TileMotion";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});
export const metadata: Metadata = {
  title: "Acadot - Master Your Focus",
  description: "Lock your device. Master your focus. AI-powered study app with device lock technology.",
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const darkMode = localStorage.getItem('darkMode') === 'true';
                if (darkMode) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${sora.variable} ${playfair.variable} ${dmMono.variable} antialiased`}
      >
        <SessionProvider>
          <CursorSpotlight />
          <TileMotion />
          <PageTransition>{children}</PageTransition>
        </SessionProvider>
      </body>
    </html>
  );
}
