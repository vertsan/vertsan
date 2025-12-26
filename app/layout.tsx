import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Vert San - Developer",
  description:
    "A passionate web developer crafting modern, scalable web experiences from Cambodia.",
  keywords: ["web developer", "Cambodia", "Next.js", "React", "TypeScript"],
  openGraph: {
    title: "Vert San - Developer",
    description:
      "A passionate web developer crafting modern, scalable web experiences from Cambodia.",
    url: "https://vertsan.vercel.app",
    siteName: "Vert San",
    images: [
      {
        url: "https://vertsan.vercel.app/og.png",
        width: 1200,
        height: 630,
      },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <main className=" mx-auto  p-4 sm:px-0 sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-6xl w-full">
            <div className="min-h-screen flex flex-col">
              <Navbar />
              {children}

              <Footer />
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
