import { FC, ReactNode } from 'react';
import { Button } from '@components/Button';
import state from '@state';
import { useRecoilState } from 'recoil';
import { IFields } from '@components/Fields';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import ArrowChevronUp from '@src/assets/arrow-chevron-up.svg?react';
import './DuplicateGroupContainer.scss';

interface IDuplicateGroupContainer {
  entry: SchemaEntry;
  generateComponent: (f: Partial<IFields>) => ReactNode;
  groupClassName?: string;
}

export const DuplicateGroupContainer: FC<IDuplicateGroupContainer> = ({ entry, generateComponent, groupClassName }) => {
  const [collapsedGroups, setCollapsedGroups] = useRecoilState(state.ui.collapsedGroups);
  const { uuid, clonedBy } = entry;
  const clonesAmount = clonedBy?.length;
  const isCollapsed = collapsedGroups.includes(uuid);

  return (
    <div className={classNames('duplicate-group-container', groupClassName)}>
      {generateComponent({ uuid, groupingDisabled: true })}
      <Button
        className="expand-collapse-button"
        onClick={() =>
          setCollapsedGroups(prev => (prev.includes(uuid) ? prev.filter(i => i !== uuid) : [...prev, uuid]))
        }
      >
        <ArrowChevronUp className={classNames({ 'arrow-closed': isCollapsed })} />
        <span>
          <FormattedMessage
            id={isCollapsed ? 'marva.showAllWithCount' : 'marva.hide'}
            values={{
              amt: clonesAmount ? (
                <span data-testid="duplicate-group-clone-amount">{clonesAmount + 1}</span>
              ) : undefined,
            }}
          />
        </span>
      </Button>
      {!isCollapsed && clonedBy?.map(cloneUuid => generateComponent({ uuid: cloneUuid, groupingDisabled: true }))}
    </div>
  );
};
