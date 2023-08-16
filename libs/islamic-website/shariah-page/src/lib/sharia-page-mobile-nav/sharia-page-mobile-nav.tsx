'use client';
import { useState } from 'react';
import { Select } from '@haqq/islamic-ui-kit';

export function ShariPageMobileNav() {
  const [current, setCurrent] = useState<undefined | string>('fatwa');
  const variants = {
    fatwa: 'Fatwa',
    foundations: 'Foundations',
    'shariah-oracle': 'Shariah Oracle',
    'shariah-board': 'Shariah Board',
    'advisory-board': 'Advisory Board',
    'executive-board': 'Executive Board',
  };

  return (
    <Select
      variants={variants}
      current={current}
      onChange={setCurrent}
      className="w-full md:max-w-[360px]"
      placeholder=""
    />
  );
}
