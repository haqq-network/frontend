import type { Meta, StoryFn } from '@storybook/react';
import { SortSelect as SortSelectComponent } from './sort-select';
import { useState } from 'react';

const meta: Meta<typeof SortSelectComponent> = {
  component: SortSelectComponent,
  title: 'shell/ui-kit',
};

export default meta;

export const SortSelect: StoryFn<typeof SortSelectComponent> = ({
  variants,
  current,
  placeholder,
  onChange,
}) => {
  const [storyCurrent, setStoryCurrent] = useState(current);

  return (
    <SortSelectComponent
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

SortSelect.args = {
  placeholder: 'Sorting by',
  current: 'random',
  variants: [
    { id: 'random', title: 'Random' },
    { id: 'by-name-asc', title: 'By name (a-z)' },
    { id: 'by-name-desc', title: 'By name (z-a)' },
    { id: 'by-power-asc', title: 'By power (a-z)' },
    { id: 'by-power-desc', title: 'By power (z-a)' },
  ],
};
