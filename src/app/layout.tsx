import type { Metadata } from 'next';
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
  title: 'ハリー・ポッタ～９と3/4番線～',
  description: '質問に答えて、あなたの寮を診断します！',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`dark ${literata.variable} ${quicksand.variable}`}>
      <body className={`${quicksand.className} antialiased min-h-screen flex flex-col font-body`}>
        <AppProviders>
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
          <Footer />
          <Toaster />
        </AppProviders>
      </body>
    </html>
  );
}
