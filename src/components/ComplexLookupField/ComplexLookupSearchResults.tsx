import { FC, useCallback, useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { FormattedMessage } from 'react-intl';
import { COMPLEX_LOOKUPS_LINKED_FIELDS_MAPPING } from '@common/constants/complexLookup.constants';
import { formatItemSearchComplexLookupAuthority } from '@common/helpers/search.helper';
import { Row, Table } from '@components/Table';
import { Button, ButtonType } from '@components/Button';
import state from '@state';

const listHeader: Row = {
  title: {
    label: <FormattedMessage id="ld.heading" />,
    position: 0,
    className: 'cell-relative-45',
  },
  subclass: {
    label: <FormattedMessage id="ld.subclass" />,
    position: 1,
  },
  lccn: {
    label: <FormattedMessage id="ld.lccn" />,
    position: 2,
    className: 'cell-relative-20',
  },
  assign: {
    label: '',
    position: 3,
    className: 'cell-fixed-100',
  },
};

type ComplexLookupSearchResultsProps = {
  onAssign: ({ id, title, linkedFieldValue }: ComplexLookupAssignRecordDTO) => void;
};

export const ComplexLookupSearchResults: FC<ComplexLookupSearchResultsProps> = ({ onAssign }) => {
  const data = useRecoilValue(state.search.data);
  const { subclass: subclassMapping } = COMPLEX_LOOKUPS_LINKED_FIELDS_MAPPING;

  const applyActionItems = useCallback(
    (rows: Row[]): Row[] =>
      rows.map(row => ({
        ...row,
        title: {
          ...row.title,
          children: (
            <div className="search-result-cell-content">
              <Button type={ButtonType.Link} onClick={() => null}>
                {row.title.label}
              </Button>
            </div>
          ),
        },
        subclass: {
          children: (
            <FormattedMessage
              id={subclassMapping[row.subclass?.label as unknown as keyof typeof subclassMapping]?.labelId}
            />
          ),
        },
        assign: {
          children: (
            <Button
              type={ButtonType.Primary}
              onClick={() => {
                onAssign({
                  id: row.__meta.id,
                  title: row.title?.label as string,
                  linkedFieldValue: row.subclass?.label as string,
                });
              }}
            >
              <FormattedMessage id="ld.assign" />
            </Button>
          ),
        },
      })),
    [onAssign, subclassMapping],
  );

  const formattedData = useMemo(
    () => applyActionItems(formatItemSearchComplexLookupAuthority(data || [])),
    [applyActionItems, data],
  );

  return (
    <div className="search-result-list">
      <Table header={listHeader} data={formattedData} className="results-list" />
    </div>
  );
};
