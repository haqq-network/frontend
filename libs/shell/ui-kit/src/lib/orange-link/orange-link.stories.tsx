import { withRouter } from 'storybook-addon-react-router-v6';
import { OrangeLink as OrangeLinkComponent } from './orange-link';

export default {
  title: 'shell/ui-kit/orange-link',
  decorators: [withRouter],
  parameters: {
    layout: 'centered',
  },
};

export const Default = () => {
  return <OrangeLinkComponent href="/">Orange link</OrangeLinkComponent>;
};

export const WithTarget = () => {
  return (
    <OrangeLinkComponent
      href="https://haqq.network/"
      rel="noopener noreferrer"
      target="_blank"
    >
      Orange link
    </OrangeLinkComponent>
  );
};
