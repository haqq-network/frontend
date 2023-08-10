import { Container, MarkdownText } from '@haqq/islamic-ui-kit';

export function WhitepaperPage({ whitepaper }: { whitepaper: string }) {
  return (
    <section>
      <Container>
        <MarkdownText>{whitepaper}</MarkdownText>
      </Container>
    </section>
  );
}
