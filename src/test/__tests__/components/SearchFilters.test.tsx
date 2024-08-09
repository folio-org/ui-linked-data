import { fireEvent, render, screen } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import { SearchFilters } from '@components/SearchFilters';
import { SearchContext } from '@src/contexts';
import {
  FiltersGroupCheckType,
  FiltersType,
  Format,
  PublishDate,
  SearchLimiterNames,
} from '@common/constants/search.constants';

const setSearchParams = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useSearchParams: () => [{}, setSearchParams],
}));

describe('SearchFilters', () => {
  const filters = [
    {
      labelId: 'groupLabelId',
      type: FiltersGroupCheckType.Single,
      children: [
        {
          id: PublishDate.AllTime,
          type: FiltersType.Radio,
          name: SearchLimiterNames.PublishDate,
          labelId: 'marva.allTime',
        },
        {
          id: PublishDate.TwelveMonths,
          type: FiltersType.Radio,
          name: SearchLimiterNames.PublishDate,
          labelId: 'marva.past12Months',
        },
      ],
    },
    {
      labelId: 'marva.format',
      type: FiltersGroupCheckType.Multi,
      children: [
        {
          id: Format.Volume,
          type: FiltersType.Checkbox,
          name: SearchLimiterNames.Format,
          labelId: 'marva.volume',
        },
      ],
    },
  ] as SearchFilters;

  beforeEach(() =>
    render(
      <RecoilRoot>
        <SearchContext.Provider value={{ filters } as unknown as SearchParams}>
          <SearchFilters />
        </SearchContext.Provider>
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
