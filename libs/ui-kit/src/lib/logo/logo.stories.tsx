import { ComponentStory } from '@storybook/react';
import { Logo as LogoComponent, LogoSign as LogoSignComponent } from './logo';

export default {
  title: 'ui-kit/Logotypes',
  parameters: {
    layout: 'centered',
  },
};

export const Logo: ComponentStory<typeof LogoComponent> = () => {
  return <LogoComponent className="text-primary h-[36px]" />;
};

export const LogoSign: ComponentStory<typeof LogoSignComponent> = () => {
  return <LogoSignComponent className="text-primary h-[36px]" />;
};
