import { fireEvent, render, screen } from '@testing-library/react';
import { SearchContext, SearchFilters } from '@/features/search';
import {
  FiltersGroupCheckType,
  FiltersType,
  Format,
  PublishDate,
  SearchLimiterNames,
} from '@/common/constants/search.constants';

const setSearchParams = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useSearchParams: () => [{}, setSearchParams],
}));

jest.mock('@/common/constants/build.constants', () => ({ IS_EMBEDDED_MODE: false }));

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
          labelId: 'ld.allTime',
        },
        {
          id: PublishDate.TwelveMonths,
          type: FiltersType.Radio,
          name: SearchLimiterNames.PublishDate,
          labelId: 'ld.past12Months',
        },
      ],
    },
    {
      labelId: 'ld.format',
      type: FiltersGroupCheckType.Multi,
      children: [
        {
          id: Format.Volume,
          type: FiltersType.Checkbox,
          name: SearchLimiterNames.Format,
          labelId: 'ld.volume',
        },
      ],
    },
  ] as SearchFilters;

  beforeEach(() =>
    render(
      <SearchContext.Provider value={{ filters } as unknown as SearchParams}>
        <SearchFilters />
      </SearchContext.Provider>,
    ),
  );

  test('changes limiters', () => {
    const initRadio = screen.getByLabelText('ld.allTime');

    expect(initRadio).toBeChecked();

    fireEvent.click(screen.getByLabelText('ld.past12Months'));

    expect(initRadio).not.toBeChecked();
  });

  test('adds and removes to the selection of limiters with multiselection option', () => {
    const initCheckbox = screen.getByLabelText('ld.volume');
    expect(initCheckbox).not.toBeChecked();

    fireEvent.click(initCheckbox);
    expect(initCheckbox).toBeChecked();

    fireEvent.click(initCheckbox);
    expect(initCheckbox).not.toBeChecked();
  });
});
