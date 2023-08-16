import { headers } from 'next/headers';
import { Footer } from '../components/footer/footer';
import { Header } from '../components/header/header';
import { Alexandria } from 'next/font/google';

import 'swiper/css';
import 'swiper/css/navigation';
import '../styles/global.css';

export const metadata = {
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
  const headersList = headers();
  const userAgent = headersList.get('user-agent');
  const isMobile = Boolean(
    userAgent!.match(
      /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i,
    ),
  );

  return (
    <html lang="en" className={alexandria.variable}>
      <body className="bg-islamic-bg-black relative flex min-h-screen flex-col font-serif text-white antialiased">
        <Header isMobile={isMobile} />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
