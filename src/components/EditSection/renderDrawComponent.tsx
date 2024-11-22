import { SetterOrUpdater } from 'recoil';
import { DrawComponent, IDrawComponent } from './DrawComponent';

export type EditSectionDataProps = {
  selectedEntriesService: ISelectedEntriesService;
  selectedEntries: string[];
  setSelectedEntries: SetterOrUpdater<string[]>;
  userValues: UserValues;
  collapsedEntries: Set<string>;
  collapsibleEntries: Set<string>;
  onChange: (uuid: string, contents: UserValueContents[]) => void;
  handleGroupsCollapseExpand: VoidFunction;
};

export const renderDrawComponent =
  (props: EditSectionDataProps) =>
  ({ schema, entry, disabledFields, level = 0, isCompact = false }: IDrawComponent) => (
    <DrawComponent
      schema={schema}
      entry={entry}
      disabledFields={disabledFields}
      level={level}
      isCompact={isCompact}
      {...props}
    />
  );
