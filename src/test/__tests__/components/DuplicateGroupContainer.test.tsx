import { fireEvent, render, screen } from '@testing-library/react';
import { DuplicateGroupContainer } from '@components/DuplicateGroupContainer';
import { RecoilRoot } from 'recoil';
import { Fragment, ReactNode } from 'react';

const mockEntryUuid = 'c787b94b-faba-47fe-8221-f43e5b7d266e';
const mockClonedByUuid = '401d21e4-1ec8-4c3b-8d92-473290a7798f';

const mockEntry = {
  uuid: mockEntryUuid,
  clonedBy: [mockClonedByUuid],
};

jest.mock('react-intl', () => ({
  FormattedMessage: ({ id, values }: any) => {
    return (
      <div id={id}>
        {Object.entries(values).map(([k, v]) => (
          <Fragment key={k}>{v as ReactNode}</Fragment>
        ))}
      </div>
    );
  },
}));

describe('DuplicateGroupContainer', () => {
  const { getByText, getByTestId, queryByText } = screen;
  const toggleButton = () => fireEvent.click(getByTestId('expand-collapse-button'));

  beforeEach(() => {
    render(
      <RecoilRoot>
        <DuplicateGroupContainer
          entry={mockEntry as SchemaEntry}
          generateComponent={({ uuid }) => <div key={uuid}>{uuid}</div>}
        />
      </RecoilRoot>,
    );
  });

  test('toggles collapsible component and shows the number of entries', () => {
    toggleButton();

    expect(queryByText(mockClonedByUuid)).not.toBeInTheDocument();

    toggleButton();

    expect(getByText(mockClonedByUuid)).toBeInTheDocument();
  });
});
