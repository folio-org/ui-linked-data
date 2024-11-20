import { FC, ReactNode } from 'react';
import { Button } from '@components/Button';
import state from '@state';
import { useRecoilState } from 'recoil';
import { IFields } from '@components/Fields';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import ArrowChevronUp from '@src/assets/arrow-chevron-up.svg?react';
import { deleteFromSetImmutable } from '@common/helpers/common.helper';
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
  const [collapsedEntries, setCollapsedEntries] = useRecoilState(state.ui.collapsedEntries);
  const twinsAmount = twins.length;
  const visibleTwins = twins.filter(twinUuid => !collapsedEntries.has(twinUuid));
  const isCollapsed = visibleTwins.length === 0;

  const toggleCollapseExpand = () =>
    setCollapsedEntries(prev => {
      const twinsAndPrevCombined = new Set([...(twins ?? []), ...prev]);

      if (twinsAndPrevCombined.size === prev.size) {
        // Can use .difference method of Set() once it's been available for some time
        return deleteFromSetImmutable(prev, twins) as Set<string>;
      } else {
        return twinsAndPrevCombined;
      }
    });

  return (
    <div key={uuid} className={classNames('duplicate-group-container', groupClassName)}>
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
