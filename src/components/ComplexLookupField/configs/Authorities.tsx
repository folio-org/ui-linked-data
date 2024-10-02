import { FormattedMessage } from 'react-intl';
import { Button, ButtonType } from '@components/Button';

export const authoritiesTableConfig: SearchResultsTableConfig = {
  columns: {
    assign: {
      label: '',
      position: 0,
      className: 'cell-fixed-100',
      formatter: (
        row: SearchResultsTableRow,
        _: AbstractIntlFormatter,
        onAssign: ({ id, title, linkedFieldValue }: ComplexLookupAssignRecordDTO) => void,
      ) => (
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
      ),
    },
    authorized: {
      label: 'ld.authorizedReference',
      position: 1,
      className: 'cell-relative-20',
    },
    title: {
      label: 'ld.headingReference',
      position: 1,
      className: 'cell-relative-45',
    },
    headingType: {
      label: 'ld.typeOfHeading',
      position: 2,
      className: 'cell-relative-20',
    },
    authoritySource: {
      label: 'ld.authoritySource',
      position: 3,
      className: 'cell-relative-20',
    },
  },
};
