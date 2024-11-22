import { FC } from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import Lightbulb16 from '@src/assets/lightbulb-shining-16.svg?react';
import { RESOURCE_TEMPLATE_IDS } from '@common/constants/bibframe.constants';
import { BLOCKS_BFLITE } from '@common/constants/bibframeMapping.constants';
import { getRecordId } from '@common/helpers/record.helper';
import { Button, ButtonType } from '@components/Button';
import { PreviewActionsDropdown } from '@components/PreviewActionsDropdown';

type LabelProps = {
  isEntity: boolean;
  isBlock: boolean;
  isGroupable: boolean;
  isInstance: boolean;
  altDisplayNames?: Record<string, string>;
  displayNameWithAltValue: string;
  showEntityActions: boolean;
  bfid: string;
  handleNavigateToEditPage: VoidFunction;
  record: RecordEntry<RecursiveRecordSchema> | null;
};

export const Labels: FC<LabelProps> = ({
  isEntity,
  isBlock,
  isGroupable,
  isInstance,
  altDisplayNames,
  displayNameWithAltValue,
  showEntityActions,
  bfid,
  handleNavigateToEditPage,
  record,
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
      {showEntityActions && !isInstance && (
        <Button type={ButtonType.Primary} className="toggle-entity-edit" onClick={handleNavigateToEditPage}>
          <FormattedMessage id={`ld.edit${RESOURCE_TEMPLATE_IDS[bfid]}`} />
        </Button>
      )}
      {showEntityActions && isInstance && (
        <PreviewActionsDropdown
          ownId={getRecordId(record, BLOCKS_BFLITE.WORK.uri, BLOCKS_BFLITE.INSTANCE.referenceKey)}
          referenceId={getRecordId(record, BLOCKS_BFLITE.WORK.uri)}
          entityType={BLOCKS_BFLITE.INSTANCE.resourceType}
          handleNavigateToEditPage={handleNavigateToEditPage}
        />
      )}
    </strong>
  );
};
