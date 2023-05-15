import { Page as PageComponent } from './page';
import { Header as HeaderComponent } from '../header/header';
import { withRouter } from 'storybook-addon-react-router-v6';

export default {
  title: 'shell/ui-kit/page',
  layout: 'centered',
  decorators: [withRouter],
};

export const Default = () => {
  return (
    <PageComponent className="text-white">
      <HeaderComponent />
      I'm a page component
    </PageComponent>
  );
};
