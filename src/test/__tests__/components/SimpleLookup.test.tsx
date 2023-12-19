import { /* act, */ fireEvent, render, screen, waitFor } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import { SimpleLookupField } from '@components/SimpleLookupField';
import * as LookupConstants from '@src/common/constants/lookup.constants';
import { getMockedImportedConstant } from '@src/test/__mocks__/common/constants/constants.mock';

const mockOptionLabel = 'testLabel_1';
const mockNonDisplayableValue = 'mockNonDisplayableValue';
const mockAuthLabel = 'mockAuthLabel';
const mockImportedConstant = getMockedImportedConstant(LookupConstants, 'AUTHORITATIVE_LABEL_URI');

mockImportedConstant(mockAuthLabel);

const mockLookupData = [
  {
    label: mockOptionLabel,
    __isNew__: true,
    value: {
      id: 'testId_1',
      label: mockOptionLabel,
      uri: 'testUri_1',
    },
  },
];

const mockOnChange = jest.fn();
const mockGetLookupData = jest.fn();
const mockLoadLookupData = jest.fn();

const mockProps = {
  uri: 'mock-uri',
  displayName: 'mock-displayname',
  uuid: 'mock-uuid',
  onChange: mockOnChange,
};

jest.mock('@common/hooks/useSimpleLookupData', () => ({
  useSimpleLookupData: () => ({
    getLookupData: mockGetLookupData,
    loadLookupData: mockLoadLookupData,
  }),
}));

describe('SimpleLookup', () => {
  const renderComponent = () =>
    render(
      <RecoilRoot>
        <SimpleLookupField {...mockProps} />
      </RecoilRoot>,
    );

  describe('with label', () => {
    test('renders SimpleLookup component', async () => {
      mockGetLookupData.mockReturnValueOnce({});

      renderComponent();

      expect(await screen.findByTestId('simple-lookup-container')).toBeInTheDocument();
    });

    test('loads and displays options', async () => {
      mockGetLookupData.mockReturnValueOnce({}).mockReturnValue({
        'mock-uri': mockLookupData,
      });
      mockLoadLookupData.mockResolvedValueOnce(mockLookupData);

      renderComponent();
      const selectElement = screen.queryByText('marva.select');

      if (selectElement) {
        fireEvent.keyDown(selectElement, { key: 'ArrowDown' });

        await waitFor(() => expect(mockLoadLookupData).toHaveBeenCalledTimes(1));

        expect(screen.queryByText(mockNonDisplayableValue)).not.toBeInTheDocument();
        expect(await screen.findByText(mockOptionLabel)).toBeInTheDocument();
      }
    });

    test("doesn't load options if they are already fetched", async () => {
      mockGetLookupData.mockReturnValue({
        'mock-uri': mockLookupData,
      });

      renderComponent();
      const selectElement = screen.queryByText('marva.select');

      if (selectElement) {
        fireEvent.keyDown(selectElement, { key: 'ArrowDown' });

        expect(await screen.findByText(mockOptionLabel)).toBeInTheDocument();

        fireEvent.keyDown(selectElement, { key: 'Escape' });
        fireEvent.keyDown(selectElement, { key: 'ArrowDown' });
      }

      await waitFor(() => expect(mockLoadLookupData).toHaveBeenCalledTimes(0));
    });

    test('selects an option', async () => {
      mockGetLookupData.mockReturnValue({
        'mock-uri': mockLookupData,
      });

      renderComponent();
      const selectElement = screen.queryByText('marva.select');

      if (selectElement) {
        fireEvent.keyDown(selectElement, { key: 'ArrowDown' });

        fireEvent.click(await screen.findByText(mockOptionLabel));
      }

      await waitFor(() => expect(mockOnChange).toHaveBeenCalled());
    });
  });

  describe('with different props', () => {
    beforeEach(() =>
      render(
        <RecoilRoot>
          <SimpleLookupField {...{ ...mockProps, displayName: undefined }} />
        </RecoilRoot>,
      ),
    );

    test('renders SimpleLookup component without label', () => {
      expect(screen.queryByTestId('simple-lookup-label')).not.toBeInTheDocument();
    });
  });
});
