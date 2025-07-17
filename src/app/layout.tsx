import type { Metadata } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import Link from 'next/link';
import "./globals.css";
import { TestProvider } from "./context/TestContext";
import { NextThemeProvider } from './theme-provider';

const noto_sans_thai = Noto_Sans_Thai({ subsets: ["thai", "latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
      title: "แบบประเมิน MoCA",
      description: "เครื่องมือคัดกรองความสามารถทางสมองที่ทันสมัยตามแบบทดสอบ MoCA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
      </head>
            <body className={`${noto_sans_thai.className} bg-slate-50 dark:bg-gray-900`}>
        <NextThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TestProvider>
            <div className="min-h-screen flex flex-col">
              <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
                <nav className="container mx-auto px-4 sm:px-6 py-3">
                  <div className="flex justify-between items-center">
                    <Link href="/" className="text-xl sm:text-2xl font-bold text-blue-800 dark:text-blue-300 hover:text-blue-600 dark:hover:text-blue-200 transition-colors">
                      แบบประเมิน MoCA
                    </Link>
                  </div>
                </nav>
              </header>
              <main className="flex-grow container mx-auto px-4 sm:px-6 py-4 sm:py-6">
                {children}
              </main>
            </div>
          </TestProvider>
        </NextThemeProvider>
      </body>
    </html>
  );
}
