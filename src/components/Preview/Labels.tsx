import { FC } from 'react';
import classNames from 'classnames';
import Lightbulb16 from '@src/assets/lightbulb-shining-16.svg?react';

type LabelProps = {
  isEntity: boolean;
  isBlock: boolean;
  isGroupable: boolean;
  isInstance: boolean;
  altDisplayNames?: Record<string, string>;
  displayNameWithAltValue: string;
};

export const Labels: FC<LabelProps> = ({
  isEntity,
  isBlock,
  isGroupable,
  isInstance,
  altDisplayNames,
  displayNameWithAltValue,
}) => {
  return (
    <strong
      className={classNames({
        'entity-heading': isEntity,
        'sub-heading': isBlock,
        'value-heading': !isGroupable,
      })}
    >
      {isEntity && !isInstance && !altDisplayNames && <Lightbulb16 />}
      {displayNameWithAltValue}
    </strong>
  );
};
