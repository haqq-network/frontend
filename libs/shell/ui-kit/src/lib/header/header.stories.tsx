import { withRouter } from 'storybook-addon-react-router-v6';
import { Header as HeaderComponent } from './header';
import { withoutPadding } from '../../../.storybook/decorators';

export default {
  title: 'shell/ui-kit/header',
  decorators: [withRouter, withoutPadding],
};

export const Default = () => {
  return <HeaderComponent />;
};
