import { render } from '@testing-library/react';
import { AddressConversionPage } from './address-conversion-page';

describe('AddressConversion', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AddressConversionPage />);
    expect(baseElement).toBeTruthy();
  });
});
