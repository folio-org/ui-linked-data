import { FormattedMessage } from 'react-intl';
import { useComplexLookupValidation } from '@common/hooks/useComplexLookupValidation';
import { AuthRefType } from '@common/constants/search.constants';
import { Button, ButtonType } from '@components/Button';

export const AssignFormatter = ({
  row,
  onAssign,
}: {
  row: SearchResultsTableRow;
  onAssign: ({ id, title, linkedFieldValue }: ComplexLookupAssignRecordDTO) => void;
}) => {
  const { checkFailedId } = useComplexLookupValidation();
  const isAuthorized = row.authorized.label === AuthRefType.Authorized;
  const isDisabled = checkFailedId(row.__meta.id);

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
      disabled={isDisabled}
    >
      <FormattedMessage id="ld.assign" />
    </Button>
  ) : null;
};
