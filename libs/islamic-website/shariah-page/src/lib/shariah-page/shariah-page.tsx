import { Fragment } from 'react';
import { HeroBlock } from '../hero-block/hero-block';
import { FatwaBlock } from '../fatwa-block/fatwa-block';

export function ShariahPage() {
  return (
    <Fragment>
      <HeroBlock />;
      <FatwaBlock />
    </Fragment>
  );
}
