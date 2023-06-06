import { useState } from 'react';

export function useToggle(
  defaultValue = false,
): [value: boolean, toggle: () => void] {
  const [value, setValue] = useState(defaultValue);
  const toggle = () => {
    return setValue(!value);
  };

  return [value, toggle];
}
