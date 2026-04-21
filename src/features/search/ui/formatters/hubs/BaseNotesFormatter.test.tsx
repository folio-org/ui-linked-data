import { IntlProvider } from 'react-intl';

import { render, screen } from '@testing-library/react';

import { BaseNotesFormatter } from './BaseNotesFormatter';

const renderWithIntl = (component: React.ReactElement) => {
  return render(<IntlProvider locale="en">{component}</IntlProvider>);
};

describe('BaseNotesFormatter', () => {
  const mockRowWithAuthLabel = {
    auth: {
      label: 'ld.testAuthLabel',
    },
    rda: {
      label: 'ld.testRdaLabel',
    },
  } as SearchResultsTableRow;
  const mockRowWithRdaLabel = {
    auth: {
      label: 'ld.testAuthLabel',
    },
    rda: {
      label: 'ld.testRdaLabel',
    },
  } as SearchResultsTableRow;
  const mockRowWithoutAuthLabel = {
    auth: {
      label: undefined,
    },
    rda: {
      label: 'ld.testRdaLabel',
    },
  } as SearchResultsTableRow;
  const mockRowWithoutRdaLabel = {
    auth: {
      label: 'ld.testAuthLabel',
    },
    rda: {
      label: undefined,
    },
  } as SearchResultsTableRow;
  const mockRowWithNullLabels = {
    auth: {
      label: null,
    },
    rda: {
      label: null,
    },
  } as unknown as SearchResultsTableRow;
  const mockRowWithEmptyObject = {
    auth: {},
    rda: {},
  } as SearchResultsTableRow;

  describe('with auth fieldKey', () => {
    test('renders formatted message when auth label exists', () => {
      renderWithIntl(<BaseNotesFormatter row={mockRowWithAuthLabel} fieldKey="auth" />);

      expect(screen.getByText('ld.testAuthLabel')).toBeInTheDocument();
    });

    test('renders dash when auth label is undefined', () => {
      renderWithIntl(<BaseNotesFormatter row={mockRowWithoutAuthLabel} fieldKey="auth" />);

      expect(screen.getByText('-')).toBeInTheDocument();
    });

    test('renders dash when auth label is null', () => {
      renderWithIntl(<BaseNotesFormatter row={mockRowWithNullLabels} fieldKey="auth" />);

      expect(screen.getByText('-')).toBeInTheDocument();
    });

    test('renders dash when auth object is empty', () => {
      renderWithIntl(<BaseNotesFormatter row={mockRowWithEmptyObject} fieldKey="auth" />);

      expect(screen.getByText('-')).toBeInTheDocument();
    });
  });

  describe('with rda fieldKey', () => {
    test('renders formatted message when rda label exists', () => {
      renderWithIntl(<BaseNotesFormatter row={mockRowWithRdaLabel} fieldKey="rda" />);

      expect(screen.getByText('ld.testRdaLabel')).toBeInTheDocument();
    });

    test('renders dash when rda label is undefined', () => {
      renderWithIntl(<BaseNotesFormatter row={mockRowWithoutRdaLabel} fieldKey="rda" />);

      expect(screen.getByText('-')).toBeInTheDocument();
    });

    test('renders dash when rda label is null', () => {
      renderWithIntl(<BaseNotesFormatter row={mockRowWithNullLabels} fieldKey="rda" />);

      expect(screen.getByText('-')).toBeInTheDocument();
    });

    test('renders dash when rda object is empty', () => {
      renderWithIntl(<BaseNotesFormatter row={mockRowWithEmptyObject} fieldKey="rda" />);

      expect(screen.getByText('-')).toBeInTheDocument();
    });
  });
});
