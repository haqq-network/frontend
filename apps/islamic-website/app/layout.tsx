import type { Metadata } from 'next';
import { Footer } from '../components/footer/footer';
import { Header } from '../components/header/header';
import { Alexandria } from 'next/font/google';
import '../styles/global.css';
import 'swiper/css';
import 'swiper/css/navigation';

export const metadata: Metadata = {
  title: 'IslamicCoin',
};

const alexandria = Alexandria({
  subsets: ['latin', 'arabic'],
  display: 'swap',
  variable: '--font-alexandria',
  weight: ['300', '400', '600', '700', '800'],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={alexandria.variable}>
      <body className="bg-islamic-bg-black relative flex min-h-screen flex-col font-serif text-white subpixel-antialiased">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
