import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { SimpleLookupField } from '@components/SimpleLookupField';
import * as LookupConstants from '@src/common/constants/lookup.constants';
import { getMockedImportedConstant } from '@src/test/__mocks__/common/constants/constants.mock';
// import * as ApiHelper from '@common/helpers/api.helper';
import * as LookupApi from '@common/api/lookup.api';

const mockOptionValue = 'mockOptionValue';
const mockNonDisplayableValue = 'mockNonDisplayableValue';
const mockAuthLabel = 'mockAuthLabel';
const mockImportedConstant = getMockedImportedConstant(LookupConstants, 'AUTHORITATIVE_LABEL_URI');

mockImportedConstant(mockAuthLabel);

const mockResponse: unknown[] = [
  {
    '@id': 'http://id.loc.gov/vocabulary/issuance/mono',
    '@type': ['http://www.loc.gov/mads/rdf/v1#Authority'],
    [mockAuthLabel]: [
      {
        '@value': mockOptionValue,
      },
    ],
  },
  {
    '@id': 'http://id.loc.gov/vocabulary/issuance/mono',
    '@type': ['http://www.loc.gov/mads/rdf/v1#Authority'],
    [mockAuthLabel]: [
      {
        someOtherLabel: mockNonDisplayableValue,
      },
    ],
  },
  {
    '@id': '_:',
  },
];

const mockOnChange = jest.fn();

const mockProps = {
  uri: 'mock-uri',
  displayName: 'mock-displayname',
  uuid: 'mock-uuid',
  onChange: mockOnChange,
};

jest.mock('@common/api/lookup.api', () => ({
  getLookupDict: () => mockResponse,
}));

describe('SimpleLookup', () => {
  describe('with label', () => {
    beforeEach(() => render(<SimpleLookupField {...mockProps} />));

    test('renders SimpleLookup component', () => {
      expect(screen.getByTestId('simple-lookup-container')).toBeInTheDocument();
    });

    test('loads and displays options', async () => {
      const el = screen.queryByText('marva.select');
      el && fireEvent.keyDown(el, { key: 'ArrowDown' });

      expect(await screen.findByText(mockOptionValue)).toBeInTheDocument();
      expect(screen.queryByText(mockNonDisplayableValue)).not.toBeInTheDocument();
    });

    test("doesn't load options if they are already fetched", async () => {
      const el = screen.queryByText('marva.select');
      el && fireEvent.keyDown(el, { key: 'ArrowDown' });

      const getLookupDictSpy = jest.spyOn(LookupApi, 'getLookupDict');

      if (el) {
        fireEvent.keyDown(el, { key: 'ArrowDown' });

        expect(await screen.findByText(mockOptionValue)).toBeInTheDocument();

        fireEvent.keyDown(el, { key: 'Escape' });
        fireEvent.keyDown(el, { key: 'ArrowDown' });
      }

      await waitFor(() => expect(getLookupDictSpy).toHaveBeenCalledTimes(0));
    });

    test("doesn't load options if api throws", async () => {
      jest.spyOn(LookupApi, 'getLookupDict').mockResolvedValueOnce(null);

      const el = screen.queryByText('marva.select');
      el && fireEvent.keyDown(el, { key: 'ArrowDown' });

      expect(screen.queryByText(mockOptionValue)).not.toBeInTheDocument();
    });

    test('selects an option', async () => {
      const el = screen.queryByText('marva.select');

      if (el) {
        fireEvent.keyDown(el, { key: 'ArrowDown' });

        fireEvent.click(await screen.findByText(mockOptionValue));
      }

      expect(mockOnChange).toHaveBeenCalled();
    });
  });

  describe('with different props', () => {
    beforeEach(() => render(<SimpleLookupField {...{ ...mockProps, displayName: undefined }} />));

    test('renders SimpleLookup component without label', () => {
      expect(screen.queryByTestId('simple-lookup-label')).not.toBeInTheDocument();
    });
  });
});
