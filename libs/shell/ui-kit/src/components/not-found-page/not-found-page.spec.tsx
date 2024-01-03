import { render } from '@testing-library/react';
import { NotFoundPage } from './not-found-page';

describe('<NotFoundPage />', () => {
  it('should render successfully', () => {
    const { baseElement, getByText } = render(<NotFoundPage />);

    expect(baseElement).toBeInTheDocument();
    expect(getByText('404')).toBeInTheDocument();
    expect(getByText('Page not found')).toBeInTheDocument();
  });
});
