import { useRecoilValue } from 'recoil';
import { useIntl } from 'react-intl';
import state from '@state';

export const useSearchFilterLookupOptions = ({
  facet,
  hasMappedSourceData,
}: {
  facet?: string;
  hasMappedSourceData?: boolean;
  excludedOptions?: string[];
}) => {
  const sourceData = useRecoilValue(state.search.sourceData);
  const facetsData = useRecoilValue(state.search.facetsData);
  const { formatMessage } = useIntl();

  const facetValues = facet && facetsData ? facetsData?.[facet]?.values : undefined;
  let options = [] as FilterLookupOption[];

  if (facetValues) {
    options = facetValues.reduce((accum, { id, totalRecords }) => {
      const sourceElem = sourceData?.find(({ id: sourceDataId }) => sourceDataId === id);
      const selectedLabel = hasMappedSourceData ? sourceElem?.name : id;
      const label = selectedLabel?.trim() ?? formatMessage({ id: 'ld.notSpecified' });

      // Uncomment when the way to filter the options list is approved
      // if (excludedOptions?.includes(id)) return accum;

      accum.push({
        label,
        subLabel: `(${totalRecords})`,
        value: {
          id: id || '',
        },
      });

      return accum;
    }, [] as FilterLookupOption[]);
  }

  return { options };
};
