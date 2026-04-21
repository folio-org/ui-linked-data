import { FC, ReactElement, ReactNode } from 'react';

import classNames from 'classnames';

import { Cell, Row } from './Table';

type HeaderCellProps = {
  elementType: 'th' | 'td';
  cellKey: string;
  header: Row;
  label?: string | ReactElement;
  className?: string;
  onHeaderCellClick?: (c: Record<string, Cell>) => void;
  children?: ReactNode;
};

export const HeaderCell: FC<HeaderCellProps> = ({
  elementType,
  cellKey,
  header,
  label,
  className,
  onHeaderCellClick,
  ...rest
}) => {
  const Element = elementType;

  return (
    <Element
      data-testid={`${elementType}-${cellKey}`}
      className={classNames({ clickable: onHeaderCellClick }, className)}
      onClick={() => header && onHeaderCellClick?.({ [cellKey]: header[cellKey] })}
      {...rest}
    >
      <div className="table-header-contents-wrapper">{label ?? ''}</div>
    </Element>
  );
};
