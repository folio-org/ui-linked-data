import { FormattedMessage } from 'react-intl';
import { COMPLEX_LOOKUPS_LINKED_FIELDS_MAPPING } from '@common/constants/complexLookup.constants';
import { Button, ButtonType } from '@components/Button';

const { subclass: subclassMapping } = COMPLEX_LOOKUPS_LINKED_FIELDS_MAPPING;

export const authoritiesTableConfig: SearchResultsTableConfig = {
  columns: {
    title: {
      label: 'marva.title',
      position: 0,
      className: 'cell-relative-45',
      formatter: (row: SearchResultsTableRow) => <div>{row.title.label}</div>,
    },
    subclass: {
      label: 'marva.subclass',
      position: 1,
      formatter: (row: SearchResultsTableRow, formatMessage: AbstractIntlFormatter) => {
        const labelId = subclassMapping[row.subclass?.label as unknown as keyof typeof subclassMapping]?.labelId;
        const formattedLabel = labelId ? formatMessage({ id: labelId }) : '';

        return <div>{formattedLabel}</div>;
      },
    },
    lccn: {
      label: 'marva.lccn',
      position: 2,
      className: 'cell-relative-20',
    },
    assign: {
      label: '',
      position: 3,
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
        >
          <FormattedMessage id="marva.assign" />
        </Button>
      ),
    },
  },
};
