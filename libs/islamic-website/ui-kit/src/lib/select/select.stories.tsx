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
  variants: {
    fatwa: 'Fatwa',
    foundations: 'Foundations of Halal Investing',
    'shariah-oracle': 'Shariah Oracle',
    'shariah-board': 'Shariah Board',
    'advisory-board': 'Advisory Board',
    'executive-board': 'Executive Board',
    foundations2: 'Foundations of Halal Investing',
    'shariah-oracle2': 'Shariah Oracle',
    'shariah-board2': 'Shariah Board',
    'advisory-board2': 'Advisory Board',
    'executive-board2': 'Executive Board',
  },
};
