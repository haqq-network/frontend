import { render } from '@testing-library/react';

import ArticleSelect from './article-select';

describe('ArticleSelect', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ArticleSelect />);
    expect(baseElement).toBeTruthy();
  });
});
