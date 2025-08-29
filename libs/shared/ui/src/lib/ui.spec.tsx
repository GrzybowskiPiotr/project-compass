import { render } from '@testing-library/react';

import ProjectCompassUi from './ui';

describe('ProjectCompassUi', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ProjectCompassUi />);
    expect(baseElement).toBeTruthy();
  });
});
