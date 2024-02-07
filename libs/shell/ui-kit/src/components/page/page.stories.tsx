import { StoryFn } from '@storybook/react';
import { withRouter } from 'storybook-addon-react-router-v6';
import { Page as PageComponent } from './page';
import { withoutPadding } from '../../../.storybook/decorators';
import { Container } from '../container/container';
import { Heading } from '../heading/heading';

export default {
  title: 'shell/ui-kit/layout',
  decorators: [withRouter, withoutPadding],
};

export const Page: StoryFn = () => {
  return (
    <PageComponent>
      <Container className="py-12 text-center">
        <Heading level={2}>I'm a page component</Heading>
      </Container>
    </PageComponent>
  );
};
