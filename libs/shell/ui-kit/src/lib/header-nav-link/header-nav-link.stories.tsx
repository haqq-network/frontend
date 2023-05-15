import { withRouter } from 'storybook-addon-react-router-v6';
import { HeaderNavLink as HeaderNavLinkComponent } from './header-nav-link';

export default {
  title: 'shell/ui-kit/header-nav-link',
  layout: 'centered',
  decorators: [withRouter],
};

export const Default = () => {
  return <HeaderNavLinkComponent href="/">Default</HeaderNavLinkComponent>;
};

export const IsOut = () => {
  return (
    <HeaderNavLinkComponent href="https://haqq.network" isOutLink>
      IsOut
    </HeaderNavLinkComponent>
  );
};
