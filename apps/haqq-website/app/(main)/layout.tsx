import { Fragment, type PropsWithChildren } from 'react';
import { Footer } from '../../components/footer/footer';
import { Header } from '../../components/header/header';

export default function MainLayout({ children }: PropsWithChildren) {
  return (
    <Fragment>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </Fragment>
  );
}
