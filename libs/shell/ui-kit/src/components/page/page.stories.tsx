import { Container } from '../container/container';
import { Heading } from '../heading/heading';
import { Page as PageComponent } from './page';
import { withRouter } from 'storybook-addon-react-router-v6';
import { withoutPadding } from '../../../.storybook/decorators';
import { StoryFn } from '@storybook/react';

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
