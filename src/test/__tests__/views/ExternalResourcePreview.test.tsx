import { MemoryRouter } from 'react-router-dom';

import { render, screen } from '@testing-library/react';

import { ExternalResourcePreview } from '@/views';

import { useResourcePreviewQuery } from '@/features/resources';

jest.mock('@/features/resources', () => ({
  useResourcePreviewQuery: jest.fn(),
}));

jest.mock('@/common/constants/build.constants', () => ({ IS_EMBEDDED_MODE: false }));

const mockUseResourcePreviewQuery = useResourcePreviewQuery as jest.Mock;

describe('ExternalResourcePreview', () => {
  beforeEach(() => {
    mockUseResourcePreviewQuery.mockReturnValue({ data: null, isLoading: true });
  });

  const renderComponent = () =>
    render(
      <MemoryRouter>
        <ExternalResourcePreview />
      </MemoryRouter>,
    );

  test('renders ExternalResourceLoader while data is unavailable', () => {
    renderComponent();

    expect(screen.getByTestId('external-resource-loader')).toBeInTheDocument();
  });

  test('renders Preview when data is available', () => {
    mockUseResourcePreviewQuery.mockReturnValue({
      data: { schema: new Map(), userValues: {}, initKey: 'key' },
      isLoading: false,
    });

    renderComponent();

    expect(screen.getByTestId('preview-fields')).toBeInTheDocument();
  });
});
