import styled from '@emotion/styled';
import { Card, Container } from '@haqq/ui-kit';

const StyledApp = styled.div``;

export function App() {
  return (
    <StyledApp className="flex-1">
      <Container className="py-10">
        <Card>
          <h1 className="font-medium text-4xl leading-relaxed">
            Governance app
          </h1>
        </Card>
      </Container>
    </StyledApp>
  );
}

export default App;
