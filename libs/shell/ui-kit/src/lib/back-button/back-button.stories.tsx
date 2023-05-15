import { BackButton as BackButtonComponent } from './back-button';
import { withRouter } from 'storybook-addon-react-router-v6';

export default {
  title: 'shell/ui-kit/back-button',
  layout: 'centered',
  decorators: [withRouter],
};

export const Default = () => {
  return (
    <BackButtonComponent
      onClick={() => {
        console.log('Go back');
      }}
    >
      Go back
    </BackButtonComponent>
  );
};
