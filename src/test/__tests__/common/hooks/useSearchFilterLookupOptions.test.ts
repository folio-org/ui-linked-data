import { useRecoilValue } from 'recoil';
import { renderHook } from '@testing-library/react';
import { useSearchFilterLookupOptions } from '@common/hooks/useSearchFilterLookupOptions';

jest.mock('recoil');

describe('useSearchFilterLookupOptions', () => {
  const mockUseRecoilValue = useRecoilValue as jest.Mock;
  const facet = 'testFacet';

  function testUseSearchFilterLookupOptions(
    options: { facet?: string; hasMappedSourceData?: boolean },
    { sourceData, facetsData }: { sourceData: SourceDataDTO | null; facetsData: FacetsDTO },
    testResult: FilterLookupOption[],
  ) {
    mockUseRecoilValue.mockReturnValueOnce(sourceData).mockReturnValueOnce(facetsData);

    const { result } = renderHook(() => useSearchFilterLookupOptions(options));

    expect(result.current.options).toEqual(testResult);
  }

  it('returns empty options when facet is undefined', () => {
    const options = { hasMappedSourceData: true };
    const sourceData = [] as SourceDataDTO;
    const facetsData = {};
    const testResult = [] as FilterLookupOption[];

    testUseSearchFilterLookupOptions(options, { sourceData, facetsData }, testResult);
  });

  it('returns empty options when facetsData does not contain the facet', () => {
    const options = { facet, hasMappedSourceData: true };
    const sourceData = [] as SourceDataDTO;
    const facetsData = { otherFacet: { values: [] } } as unknown as FacetsDTO;
    const testResult = [] as FilterLookupOption[];

    testUseSearchFilterLookupOptions(options, { sourceData, facetsData }, testResult);
  });

  it('maps options correctly when hasMappedSourceData is true', () => {
    const options = { facet, hasMappedSourceData: true };
    const sourceData = [
      { id: '1', name: 'Name 1' },
      { id: '2', name: 'Name 2' },
    ] as SourceDataDTO;
    const facetsData = {
      testFacet: {
        values: [
          { id: '1', totalRecords: 10 },
          { id: '2', totalRecords: 20 },
        ],
      },
    } as unknown as FacetsDTO;
    const testResult = [
      { label: 'Name 1', subLabel: '(10)', value: { id: '1' } },
      { label: 'Name 2', subLabel: '(20)', value: { id: '2' } },
    ] as FilterLookupOption[];

    testUseSearchFilterLookupOptions(options, { sourceData, facetsData }, testResult);
  });

  it('maps options correctly when hasMappedSourceData is false', () => {
    const options = { facet, hasMappedSourceData: false };
    const sourceData = [] as SourceDataDTO;
    const facetsData = {
      testFacet: {
        values: [
          { id: '1', totalRecords: 10 },
          { id: '2', totalRecords: 20 },
        ],
      },
    } as unknown as FacetsDTO;
    const testResult = [
      { label: '1', subLabel: '(10)', value: { id: '1' } },
      { label: '2', subLabel: '(20)', value: { id: '2' } },
    ] as FilterLookupOption[];

    testUseSearchFilterLookupOptions(options, { sourceData, facetsData }, testResult);
  });

  it('handles empty sourceData', () => {
    const options = { facet, hasMappedSourceData: true };
    const sourceData = [] as SourceDataDTO;
    const facetsData = {
      testFacet: {
        values: [{ id: '1', totalRecords: 10 }],
      },
    } as unknown as FacetsDTO;
    const testResult = [
      {
        label: 'ld.notSpecified',
        subLabel: '(10)',
        value: { id: '1' },
      },
    ] as FilterLookupOption[];

    testUseSearchFilterLookupOptions(options, { sourceData, facetsData }, testResult);
  });
});
