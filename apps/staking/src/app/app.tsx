import React from 'react';
import styled from '@emotion/styled';
import { Container, Card } from '@haqq/ui-kit';

const StyledApp = styled.div``;

export function App() {
  return (
    <StyledApp>
      <Container className="py-10">
        <Card>
          <h1 className="font-medium text-4xl leading-relaxed text-center">
            Staking app
          </h1>
        </Card>
      </Container>
    </StyledApp>
  );
}
