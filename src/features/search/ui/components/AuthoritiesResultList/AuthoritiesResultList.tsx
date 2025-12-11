import { FC } from 'react';
import { useIntl } from 'react-intl';
import { TableFlex, type Row } from '@/components/Table';
import { useFormattedResults } from '../../hooks/useFormattedResults';
import { useAuthoritiesResultActions } from '../../hooks/useAuthoritiesResultActions';
import './AuthoritiesResultList.scss';

interface AuthoritiesResultListProps {
  context?: 'search' | 'complexLookup';
  onAssign?: (data: ComplexLookupAssignRecordDTO) => void;
  onTitleClick?: (id: string, title?: string, headingType?: string) => void;
  checkFailedId?: (id: string) => boolean;
}

export const AuthoritiesResultList: FC<AuthoritiesResultListProps> = ({
  context = 'search',
  onAssign,
  onTitleClick,
  checkFailedId,
}) => {
  const { formatMessage } = useIntl();
  const formattedData = useFormattedResults<SearchResultsTableRow>() || [];
  const { applyActionFormatters } = useAuthoritiesResultActions({
    context,
    onAssign,
    onTitleClick,
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
      },
    }),
    authorized: {
      label: formatMessage({ id: 'ld.authorizedReference' }),
      position: context === 'complexLookup' ? 1 : 0,
      className: 'cell-fixed',
      minWidth: 170,
    },
    title: {
      label: formatMessage({ id: 'ld.headingReference' }),
      position: context === 'complexLookup' ? 2 : 1,
      className: 'cell-fixed',
      minWidth: 370,
    },
    subclass: {
      label: formatMessage({ id: 'ld.typeOfHeading' }),
      position: context === 'complexLookup' ? 3 : 2,
      className: 'cell-fixed',
      minWidth: 140,
    },
    authoritySource: {
      label: formatMessage({ id: 'ld.authoritySource' }),
      position: context === 'complexLookup' ? 4 : 3,
      className: 'cell-fixed',
      minWidth: 250,
    },
  };

  return (
    <div className="authorities-result-list">
      <TableFlex header={listHeader} data={dataWithActions} className="results-table" />
    </div>
  );
};
