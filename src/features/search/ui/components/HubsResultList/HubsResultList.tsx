import { FC } from 'react';
import { useIntl } from 'react-intl';
import { TableFlex, type Row } from '@/components/Table';
import { useFormattedResults } from '../../hooks/useFormattedResults';
import { useHubsResultActions } from '../../hooks/useHubsResultActions';
import './HubsResultList.scss';

interface HubsResultListProps {
  context?: 'search' | 'complexLookup';
  onAssign?: (data: ComplexLookupAssignRecordDTO) => void;
  checkFailedId?: (id: string) => boolean;
}

export const HubsResultList: FC<HubsResultListProps> = ({ context = 'search', onAssign, checkFailedId }) => {
  const { formatMessage } = useIntl();
  const formattedData = useFormattedResults<SearchResultsTableRow>() || [];
  const { applyActionFormatters } = useHubsResultActions({
    context,
    onAssign,
    checkFailedId,
  });
  const dataWithActions = applyActionFormatters(formattedData);

  const listHeader: Row = {
    ...(context === 'complexLookup' && {
      assign: {
        label: '',
        position: 0,
        className: 'cell-fixed',
        minWidth: 100,
        maxWidth: 100,
      },
    }),
    hub: {
      label: formatMessage({ id: 'ld.hub' }),
      position: context === 'complexLookup' ? 1 : 0,
      className: 'cell-fixed',
      minWidth: 430,
    },
    auth: {
      label: formatMessage({ id: 'ld.auth' }),
      position: context === 'complexLookup' ? 2 : 1,
      className: 'cell-fixed',
      minWidth: 170,
      maxWidth: 200,
    },
    rda: {
      label: formatMessage({ id: 'ld.rda' }),
      position: context === 'complexLookup' ? 3 : 2,
      className: 'cell-fixed',
      minWidth: 170,
      maxWidth: 200,
    },
  };

  return (
    <div className="hubs-result-list">
      <TableFlex header={listHeader} data={dataWithActions} className="results-table" />
    </div>
  );
};
