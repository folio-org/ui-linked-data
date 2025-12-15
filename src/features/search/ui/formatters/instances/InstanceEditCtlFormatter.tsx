import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import { Button, ButtonType } from '@/components/Button';
import { generateEditResourceUrl } from '@/common/helpers/navigation.helper';
import type { Row } from '@/components/Table';

interface EditCtlFormatterProps {
  row: Row;
  formatMessage: (descriptor: { id: string }, values?: Record<string, unknown>) => string;
  onEdit: (url: string) => void;
}

export const InstanceEditCtlFormatter = ({ row, formatMessage, onEdit }: EditCtlFormatterProps) => {
  const rowMeta = row.__meta;
  const typedTitle = row.title.label as string;

  return (
    <Button
      type={ButtonType.Primary}
      onClick={() => onEdit(generateEditResourceUrl(rowMeta?.id as string))}
      data-testid={`edit-button__${rowMeta?.id}`}
      className={classNames(['button-nowrap', 'button-capitalize'])}
      ariaLabel={formatMessage({ id: 'ld.aria.sections.editInstance' }, { title: typedTitle })}
    >
      <FormattedMessage id="ld.editInstance" />
    </Button>
  );
};
