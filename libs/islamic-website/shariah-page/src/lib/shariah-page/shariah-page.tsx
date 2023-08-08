import { Fragment } from 'react';
import { HeroBlock } from '../hero-block/hero-block';
import { MembersContainer } from '../members-container/members-container';
import { FatwaBlock } from '../fatwa-block/fatwa-block';
import { FoundationsBlock } from '../foundations-block/foundations-block';

export function ShariahPage() {
  return (
    <Fragment>
      <HeroBlock />;
      <FatwaBlock />
    </Fragment>
  );
}
