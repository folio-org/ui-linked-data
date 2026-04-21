import { Fragment, ReactNode } from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import { DuplicateGroupContainer } from '@/components/DuplicateGroupContainer';

const mockClonedByUuid = '0xf';

const mockEntry = {
  uuid: '0xb',
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
      <DuplicateGroupContainer
        entry={mockEntry as SchemaEntry}
        generateComponent={({ uuid }) => <div key={uuid}>{uuid}</div>}
        twins={[mockClonedByUuid]}
      />,
    );
  });

  test('toggles collapsible component and shows the number of entries', () => {
    toggleButton();

    expect(queryByText(mockClonedByUuid)).not.toBeInTheDocument();

    toggleButton();

    expect(getByText(mockClonedByUuid)).toBeInTheDocument();
  });
});
