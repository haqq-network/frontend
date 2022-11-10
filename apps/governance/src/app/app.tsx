import styled from '@emotion/styled';
import { Card, Container, Page } from '@haqq/ui-kit';
import { ReactNode } from 'react';

const StyledApp = styled.div`
  background-color: #eef9f5;
`;

export function AppWrapper({ children }: { children: ReactNode }) {
  return <Page>{children}</Page>;
}

export function App() {
  return (
    <StyledApp className="flex flex-1 min-h-fit">
      <Container className="py-10">
        <Card>
          <div className="flex flex-col space-y-2">
            <h1 className="font-medium text-4xl leading-relaxed text-center">
              Governance app
            </h1>
          </div>
        </Card>
      </Container>
    </StyledApp>
  );
}
