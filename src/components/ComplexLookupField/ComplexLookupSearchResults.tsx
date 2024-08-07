import { useRecoilValue } from 'recoil';
import { formatItemSearchComplexLookupAuthority } from '@common/helpers/search.helper';
import { Row, Table } from '@components/Table';
import state from '@state';
import { Button, ButtonType } from '@components/Button';
import { FormattedMessage } from 'react-intl';
import { FC } from 'react';

const listHeader: Row = {
  heading: {
    label: <FormattedMessage id="marva.heading" />,
    position: 0,
    className: 'cell-relative-45'
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
    className: 'cell-relative-20'
  },
  assign: {
    label: '',
    position: 4,
    className: 'cell-fixed-105'
  },
};

type ComplexLookupSearchResultsProps = {
  onAssign: VoidFunction;
};

export const ComplexLookupSearchResults: FC<ComplexLookupSearchResultsProps> = ({ onAssign }) => {
  const data = useRecoilValue(state.search.data);

  const applyActionItems = (rows: Row[]): Row[] =>
    rows.map(row => ({
      ...row,
      heading: {
        ...row.heading,
        children: (
          <div className="search-result-cell-content">
            <Button type={ButtonType.Link} onClick={() => null}>
              {row.heading.label}
            </Button>
          </div>
        ),
      },
      assign: {
        children: (
          <Button
            type={ButtonType.Primary}
            onClick={() => {
              onAssign();
            }}
          >
            <FormattedMessage id="marva.assign" />
          </Button>
        ),
      },
    }));

  const formattedData = applyActionItems(formatItemSearchComplexLookupAuthority(data || []));

  return (
    <div className="search-result-list">
      <Table header={listHeader} data={formattedData} className="results-list" />
    </div>
  );
};
