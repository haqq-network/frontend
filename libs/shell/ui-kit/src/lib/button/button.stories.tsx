import { Button as ButtonComponent } from './button';

export default {
  title: 'shell/ui-kit/button',
  parameters: {
    layout: 'centered',
  },
};

export const FirstVariant = () => {
  return <ButtonComponent>First variant</ButtonComponent>;
};

export const SecondVariant = () => {
  return <ButtonComponent variant={2}>Second variant</ButtonComponent>;
};

export const ThirdVariant = () => {
  return <ButtonComponent variant={3}>Third variant</ButtonComponent>;
};

export const FourthVariant = () => {
  return <ButtonComponent variant={4}>Fourth variant</ButtonComponent>;
};

export const FifthVariant = () => {
  return <ButtonComponent variant={5}>Fifth variant</ButtonComponent>;
};
