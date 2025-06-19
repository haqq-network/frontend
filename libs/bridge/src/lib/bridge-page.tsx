import { Fragment } from 'react';
import { Container } from '@haqq/shell-ui-kit/server';

export function BridgePage({ chainId }: { chainId: string }) {
  return (
    <Fragment>
      <Container>
        <div>Bridge</div>
      </Container>
    </Fragment>
  );
}
