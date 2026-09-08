import type { Metadata, Viewport } from 'next';
import { Literata, Quicksand } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import AppProviders from '@/components/AppProviders';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';

const literata = Literata({
  subsets: ['latin'],
  variable: '--font-literata',
  display: 'swap',
});

const quicksand = Quicksand({
  subsets: ['latin'],
  variable: '--font-quicksand',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ホグワーツ組分け帽子 寮診断',
  description: '伝説の組分け帽子の質問に答えて、あなたのホグワーツの寮を診断しよう！',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#120d08',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`dark ${literata.variable} ${quicksand.variable}`}>
      <body className={`${quicksand.className} antialiased min-h-screen flex flex-col font-body bg-background text-foreground`}>
        <AppProviders>
          <Navbar />
          <main className="flex-grow container mx-auto px-2.5 sm:px-4 py-3 sm:py-6 max-w-3xl">
            {children}
          </main>
          <Footer />
          <Toaster />
        </AppProviders>
      </body>
    </html>
  );
}

