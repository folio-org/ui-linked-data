import { FC, ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import { Button } from '@components/Button';
import { IFields } from '@components/Fields';
import ArrowChevronUp from '@src/assets/arrow-chevron-up.svg?react';
import { deleteFromSetImmutable } from '@common/helpers/common.helper';
import { useUIState } from '@src/store';
import './DuplicateGroupContainer.scss';

interface IDuplicateGroupContainer {
  entry: SchemaEntry;
  generateComponent: (f: Partial<IFields>) => ReactNode;
  groupClassName?: string;
  twins?: string[];
}

export const DuplicateGroupContainer: FC<IDuplicateGroupContainer> = ({
  entry: { uuid },
  twins = [],
  generateComponent,
  groupClassName,
}) => {
  const { collapsedEntries, setCollapsedEntries } = useUIState();
  const twinsAmount = twins.length;
  const visibleTwins = twins.filter(twinUuid => !collapsedEntries.has(twinUuid));
  const isCollapsed = visibleTwins.length === 0;

  const toggleCollapseExpand = () =>
    setCollapsedEntries(prev => {
      const twinsAndPrevCombined = new Set([...(twins ?? []), ...prev]);

      // Can use .difference method of Set() once it's been available for some time
      return twinsAndPrevCombined.size === prev.size ? deleteFromSetImmutable(prev, twins) : twinsAndPrevCombined;
    });

  return (
    <div className={classNames('duplicate-group-container', groupClassName)}>
      {generateComponent({ uuid, groupingDisabled: true })}
      {!!twinsAmount && (
        <Button data-testid="expand-collapse-button" className="expand-collapse-button" onClick={toggleCollapseExpand}>
          <ArrowChevronUp className={classNames({ 'arrow-closed': isCollapsed })} />
          <span>
            <FormattedMessage
              id={isCollapsed ? 'ld.showAllWithCount' : 'ld.hide'}
              values={{
                amt: twinsAmount ? (
                  <span data-testid="duplicate-group-clone-amount">{twinsAmount + 1}</span>
                ) : undefined,
              }}
            />
          </span>
        </Button>
      )}
      {visibleTwins?.map(twinUuid => generateComponent({ uuid: twinUuid, groupingDisabled: true }))}
    </div>
  );
};
