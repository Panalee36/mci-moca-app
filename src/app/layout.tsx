import type { Metadata } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import "./globals.css";
import { TestProvider } from "./context/TestContext";

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
      <body className={`${noto_sans_thai.className} bg-slate-50`}>
        <TestProvider>
          <div className="min-h-screen flex flex-col">
            <header className="bg-white shadow-md">
              <nav className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
                <h1 className="text-xl sm:text-2xl font-bold text-blue-800">แบบประเมิน MoCA</h1>
              </nav>
            </header>
            <main className="flex-grow container mx-auto px-4 sm:px-6 py-4 sm:py-6">
              {children}
            </main>
          </div>
        </TestProvider>
      </body>
    </html>
  );
}
