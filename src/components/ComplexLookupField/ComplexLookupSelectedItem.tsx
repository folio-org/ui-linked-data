import { FC } from 'react';
import { useIntl } from 'react-intl';
import classNames from 'classnames';
import { IS_EMBEDDED_MODE } from '@common/constants/build.constants';
import CloseIcon from '@src/assets/times-16.svg?react';
import WarningIcon from '@src/assets/exclamation-triangle.svg?react';

type ComplexLookupSelectedItemProps = {
  id?: string;
  label?: string;
  handleDelete: (id?: string) => void;
  isPreferred?: boolean;
  noWarningField?: string;
};

export const ComplexLookupSelectedItem: FC<ComplexLookupSelectedItemProps> = ({
  id,
  label,
  isPreferred,
  handleDelete,
  noWarningField,
}) => {
  const { formatMessage } = useIntl();
  const hasWarningIcon = noWarningField && isPreferred !== undefined && !isPreferred;

  return (
    <div
      key={id}
      className={classNames([
        'complex-lookup-selected',
        IS_EMBEDDED_MODE && 'complex-lookup-selected-embedded',
        hasWarningIcon && 'complex-lookup-selected-withWarning',
      ])}
      data-testid="complex-lookup-selected"
    >
      <span className="complex-lookup-selected-label" data-testid="complex-lookup-selected-label">
        {label}
      </span>
      {hasWarningIcon && <WarningIcon className="complex-lookup-selected-icon-warning" />}
      <button
        onClick={() => handleDelete(id)}
        className="complex-lookup-selected-delete"
        data-testid="complex-lookup-selected-delete"
        aria-label={formatMessage({ id: 'ld.aria.edit.removeComplexLookupFieldValue' })}
      >
        <CloseIcon />
      </button>
    </div>
  );
};
