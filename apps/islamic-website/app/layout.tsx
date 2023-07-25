import { Footer } from '../components/footer/footer';
import { Header } from '../components/header/header';
import './global.css';

export const metadata = {
  title: 'Welcome to islamic-website',
  description: 'Generated by create-nx-workspace',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
