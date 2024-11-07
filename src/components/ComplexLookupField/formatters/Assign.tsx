import { FormattedMessage } from 'react-intl';
import { AuthRefType } from '@common/constants/search.constants';
import { Button, ButtonType } from '@components/Button';

export const AssignFormatter = ({
  row,
  onAssign,
}: {
  row: SearchResultsTableRow;
  onAssign: ({ id, title, linkedFieldValue }: ComplexLookupAssignRecordDTO) => void;
}) => {
  const isAuthorized = row.authorized.label === AuthRefType.Authorized;

  return isAuthorized ? (
    <Button
      type={ButtonType.Primary}
      onClick={() =>
        onAssign({
          id: row.__meta.id,
          title: (row.title.label as string) || '',
          linkedFieldValue: (row.subclass.label as string) || '',
        })
      }
      data-testid={`assign-button-${row.__meta.id}`}
    >
      <FormattedMessage id="ld.assign" />
    </Button>
  ) : null;
};
