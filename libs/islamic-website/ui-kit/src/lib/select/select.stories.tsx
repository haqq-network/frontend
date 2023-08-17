import type { Meta, StoryFn } from '@storybook/react';
import { Select as SelectComponent } from './select';
import { useState } from 'react';

const meta: Meta<typeof SelectComponent> = {
  component: SelectComponent,
  title: 'islamic-website/ui-kit',
};

export default meta;

export const Select: StoryFn<typeof SelectComponent> = ({
  variants,
  current,
  placeholder,
  onChange,
}) => {
  const [storyCurrent, setStoryCurrent] = useState(current);

  return (
    <SelectComponent
      variants={variants}
      current={storyCurrent}
      placeholder={placeholder}
      className="min-w-[400px]"
      onChange={(value) => {
        setStoryCurrent(value);
        onChange(value);
      }}
    />
  );
};

Select.args = {
  placeholder: 'Select article',
  variants: [
    { id: 'fatwa', title: 'Fatwa' },
    { id: 'foundations', title: 'Foundations of Halal Investing' },
    { id: 'shariah-oracle', title: 'Shariah Oracle' },
    { id: 'shariah-board', title: 'Shariah Board' },
    { id: 'advisory-board', title: 'Advisory Board' },
    { id: 'executive-board', title: 'Executive Board' },
  ],
};
