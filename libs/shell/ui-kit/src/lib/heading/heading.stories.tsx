import { Heading as HeadingComponent } from './heading';

export default {
  title: 'shell/ui-kit/heading',
  parameters: {
    layout: 'centered',
  },
};

export const H1 = () => {
  return <HeadingComponent level={1}>Level 1</HeadingComponent>;
};

export const H2 = () => {
  return <HeadingComponent>Level 2</HeadingComponent>;
};

export const H3 = () => {
  return <HeadingComponent level={3}>Level 3</HeadingComponent>;
};
