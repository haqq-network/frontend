import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Card as CardComponent } from './card';

const Story: ComponentMeta<typeof CardComponent> = {
  component: CardComponent,
  title: 'ui-kit/Card',
  parameters: {
    layout: 'centered',
  },
};
export default Story;

export const Default: ComponentStory<typeof CardComponent> = (args) => {
  return <CardComponent {...args} />;
};
Default.args = {
  rounded: true,
  children: (
    <div>
      Lorem, ipsum dolor sit amet consectetur adipisicing elit. Iste alias
      corporis, iusto, quod quisquam beatae possimus animi reiciendis eligendi
      ducimus minima. Minus, ab pariatur. Tempora odio earum facere labore
      dolorem.
    </div>
  ),
};
