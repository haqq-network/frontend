import { Fragment, type PropsWithChildren } from 'react';
import { Footer } from '../../components/footer/footer';
import { Header } from '../../components/header/header';
import { TURNSTILE_SITEKEY } from '../../constants';

export default function MainLayout({ children }: PropsWithChildren) {
  return (
    <Fragment>
      <Header turnstileSiteKey={TURNSTILE_SITEKEY} />
      <main className="flex-1">{children}</main>
      <Footer turnstileSiteKey={TURNSTILE_SITEKEY} />
    </Fragment>
  );
}
