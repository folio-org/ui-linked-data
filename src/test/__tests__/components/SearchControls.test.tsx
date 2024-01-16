import { SearchControls } from '@components/SearchControls';
import { fireEvent, render, screen } from '@testing-library/react';
import { RecoilRoot } from 'recoil';

describe('SearchControls', () => {
  beforeEach(() =>
    render(
      <RecoilRoot>
        <SearchControls submitSearch={jest.fn} clearValues={jest.fn} />
      </RecoilRoot>,
    ),
  );

  test('changes limiters', () => {
    const initRadio = screen.getByRole('radio', { name: 'marva.allTime' });

    expect(initRadio).toBeChecked();

    fireEvent.click(screen.getByRole('radio', { name: 'marva.past12Months' }));

    expect(initRadio).not.toBeChecked();
  });

  test('adds and removes to the selection of limiters with multiselection option', () => {
    const initCheckbox = screen.getByRole('checkbox', { name: 'marva.volume' });
    expect(initCheckbox).not.toBeChecked();

    fireEvent.click(initCheckbox);
    expect(initCheckbox).toBeChecked();

    fireEvent.click(initCheckbox);
    expect(initCheckbox).not.toBeChecked();
  });
});
