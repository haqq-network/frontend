import { render } from '@testing-library/react';

import SubscribeForm from './subscribe-form';

describe('SubscribeForm', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SubscribeForm />);
    expect(baseElement).toBeTruthy();
  });
});
