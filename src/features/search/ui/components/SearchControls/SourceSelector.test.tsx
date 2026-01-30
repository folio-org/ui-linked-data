import { setInitialGlobalState } from '@/test/__mocks__/store';

import { fireEvent, render, screen } from '@testing-library/react';

import { SearchParam } from '@/features/search/core';

import { useSearchStore } from '@/store';

import { SourceOption } from '../../types';
import { SourceSelector } from './SourceSelector';

const mockOnSourceChange = jest.fn();

jest.mock('../../providers/SearchProvider', () => ({
  useSearchContext: () => ({
    onSourceChange: mockOnSourceChange,
  }),
}));

jest.mock('react-intl', () => ({
  FormattedMessage: ({ id }: { id: string }) => <span>{id}</span>,
}));

jest.mock('@/components/Accordion', () => ({
  Accordion: ({ id, title, children }: { id: string; title: React.ReactNode; children: React.ReactNode }) => (
    <div data-testid={`accordion-${id}`}>
      <div data-testid="accordion-title">{title}</div>
      <div data-testid="accordion-content">{children}</div>
    </div>
  ),
}));

describe('SourceSelector', () => {
  const mockOptions: SourceOption[] = [
    { value: 'local', labelId: 'ld.source.local' },
    { value: 'external', labelId: 'ld.source.external' },
  ];

  describe('rendering', () => {
    it('renders with default props', () => {
      setInitialGlobalState([
        {
          store: useSearchStore,
          state: { navigationState: {} },
        },
      ]);

      render(<SourceSelector options={mockOptions} defaultValue="local" />);

      expect(screen.getByTestId('accordion-search-source')).toBeInTheDocument();
      expect(screen.getByText('ld.source')).toBeInTheDocument();
    });

    it('renders all option labels', () => {
      setInitialGlobalState([
        {
          store: useSearchStore,
          state: { navigationState: {} },
        },
      ]);

      render(<SourceSelector options={mockOptions} defaultValue="local" />);

      expect(screen.getByText('ld.source.local')).toBeInTheDocument();
      expect(screen.getByText('ld.source.external')).toBeInTheDocument();
    });

    it('renders with custom accordion props', () => {
      setInitialGlobalState([
        {
          store: useSearchStore,
          state: { navigationState: {} },
        },
      ]);

      render(
        <SourceSelector
          options={mockOptions}
          defaultValue="local"
          accordionId="custom-id"
          accordionTitleId="custom.title"
          groupId="custom-group"
        />,
      );

      expect(screen.getByTestId('accordion-custom-id')).toBeInTheDocument();
      expect(screen.getByText('custom.title')).toBeInTheDocument();
    });

    it('renders radio buttons with correct names', () => {
      setInitialGlobalState([
        {
          store: useSearchStore,
          state: { navigationState: {} },
        },
      ]);

      render(<SourceSelector options={mockOptions} defaultValue="local" accordionId="test-source" />);

      const localRadio = screen.getByLabelText<HTMLInputElement>('ld.source.local');
      const externalRadio = screen.getByLabelText<HTMLInputElement>('ld.source.external');

      expect(localRadio.name).toBe('test-source-option');
      expect(externalRadio.name).toBe('test-source-option');
    });
  });

  describe('default value selection', () => {
    it('selects defaultValue when navigationState has no source', () => {
      setInitialGlobalState([
        {
          store: useSearchStore,
          state: { navigationState: {} },
        },
      ]);

      render(<SourceSelector options={mockOptions} defaultValue="local" />);

      const localRadio = screen.getByLabelText<HTMLInputElement>('ld.source.local');
      const externalRadio = screen.getByLabelText<HTMLInputElement>('ld.source.external');

      expect(localRadio.checked).toBe(true);
      expect(externalRadio.checked).toBe(false);
    });

    it('uses first option when defaultValue is not provided', () => {
      setInitialGlobalState([
        {
          store: useSearchStore,
          state: { navigationState: {} },
        },
      ]);

      render(<SourceSelector options={mockOptions} />);

      const localRadio = screen.getByLabelText<HTMLInputElement>('ld.source.local');
      expect(localRadio.checked).toBe(true);
    });

    it('selects navigationState source over defaultValue', () => {
      setInitialGlobalState([
        {
          store: useSearchStore,
          state: { navigationState: { [SearchParam.SOURCE]: 'external' } },
        },
      ]);

      render(<SourceSelector options={mockOptions} defaultValue="local" />);

      const localRadio = screen.getByLabelText<HTMLInputElement>('ld.source.local');
      const externalRadio = screen.getByLabelText<HTMLInputElement>('ld.source.external');

      expect(localRadio.checked).toBe(false);
      expect(externalRadio.checked).toBe(true);
    });
  });

  describe('change handling', () => {
    it('calls onSourceChange when selecting different option', () => {
      setInitialGlobalState([
        {
          store: useSearchStore,
          state: { navigationState: {} },
        },
      ]);

      render(<SourceSelector options={mockOptions} defaultValue="local" />);

      const externalRadio = screen.getByLabelText<HTMLInputElement>('ld.source.external');
      fireEvent.click(externalRadio);

      expect(mockOnSourceChange).toHaveBeenCalledWith('external');
    });

    it('calls onSourceChange with correct value on change event', () => {
      setInitialGlobalState([
        {
          store: useSearchStore,
          state: { navigationState: {} },
        },
      ]);

      render(<SourceSelector options={mockOptions} defaultValue="local" />);

      const externalRadio = screen.getByLabelText<HTMLInputElement>('ld.source.external');
      fireEvent.click(externalRadio);

      expect(mockOnSourceChange).toHaveBeenCalledWith('external');
    });
  });

  describe('checked state', () => {
    it('checks correct radio based on navigationState value', () => {
      setInitialGlobalState([
        {
          store: useSearchStore,
          state: { navigationState: { [SearchParam.SOURCE]: 'external' } },
        },
      ]);

      render(<SourceSelector options={mockOptions} defaultValue="local" />);

      const localRadio = screen.getByLabelText<HTMLInputElement>('ld.source.local');
      const externalRadio = screen.getByLabelText<HTMLInputElement>('ld.source.external');

      expect(externalRadio.checked).toBe(true);
      expect(localRadio.checked).toBe(false);
    });

    it('maintains checked state for currently selected option', () => {
      setInitialGlobalState([
        {
          store: useSearchStore,
          state: { navigationState: { [SearchParam.SOURCE]: 'external' } },
        },
      ]);

      render(<SourceSelector options={mockOptions} defaultValue="local" />);

      const localRadio = screen.getByLabelText<HTMLInputElement>('ld.source.local');
      const externalRadio = screen.getByLabelText<HTMLInputElement>('ld.source.external');

      expect(localRadio.checked).toBe(false);
      expect(externalRadio.checked).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('handles empty options array gracefully', () => {
      setInitialGlobalState([
        {
          store: useSearchStore,
          state: { navigationState: {} },
        },
      ]);

      render(<SourceSelector options={[]} defaultValue="local" />);

      expect(screen.getByTestId('accordion-search-source')).toBeInTheDocument();
    });

    it('handles missing onSourceChange gracefully', () => {
      setInitialGlobalState([
        {
          store: useSearchStore,
          state: { navigationState: {} },
        },
      ]);

      render(<SourceSelector options={mockOptions} defaultValue="local" />);

      const externalRadio = screen.getByLabelText<HTMLInputElement>('ld.source.external');

      expect(() => fireEvent.click(externalRadio)).not.toThrow();
    });
  });
});
