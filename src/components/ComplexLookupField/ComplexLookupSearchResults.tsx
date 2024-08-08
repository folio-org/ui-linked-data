import { FC, useCallback, useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { FormattedMessage } from 'react-intl';
import { formatItemSearchComplexLookupAuthority } from '@common/helpers/search.helper';
import { Row, Table } from '@components/Table';
import { Button, ButtonType } from '@components/Button';
import state from '@state';

const listHeader: Row = {
  title: {
    label: <FormattedMessage id="marva.heading" />,
    position: 0,
    className: 'cell-relative-45',
  },
  subclass: {
    label: <FormattedMessage id="marva.subclass" />,
    position: 1,
  },
  source: {
    label: <FormattedMessage id="marva.source" />,
    position: 2,
  },
  lccn: {
    label: <FormattedMessage id="marva.lccn" />,
    position: 3,
    className: 'cell-relative-20',
  },
  assign: {
    label: '',
    position: 4,
    className: 'cell-fixed-100',
  },
};

type ComplexLookupSearchResultsProps = {
  sourceLabel: string;
  onAssign: (row: Row) => void;
};

export const ComplexLookupSearchResults: FC<ComplexLookupSearchResultsProps> = ({ sourceLabel, onAssign }) => {
  const data = useRecoilValue(state.search.data);

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
        source: {
          children: <FormattedMessage id={sourceLabel} />,
        },
        assign: {
          children: (
            <Button
              type={ButtonType.Primary}
              onClick={() => {
                onAssign(row);
              }}
            >
              <FormattedMessage id="marva.assign" />
            </Button>
          ),
        },
      })),
    [onAssign, sourceLabel],
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
