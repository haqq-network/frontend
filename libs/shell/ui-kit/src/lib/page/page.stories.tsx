import { Page as PageComponent } from './page';
import { withRouter } from 'storybook-addon-react-router-v6';

export default {
  title: 'shell/ui-kit/page',
  decorators: [withRouter],
};

export const Default = () => {
  return (
    <PageComponent className="text-white">I'm a page component</PageComponent>
  );
};
