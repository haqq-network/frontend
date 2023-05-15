import { withRouter } from 'storybook-addon-react-router-v6';
import { Header as HeaderComponent } from './header';

export default {
  title: 'shell/ui-kit/header',
  decorators: [withRouter],
};

export const Default = () => {
  return <HeaderComponent />;
};
