export type Container = Record<string, any>;

export type TraverseSchemaParams = {
  container?: Container;
  key: string;
  index?: number;
  shouldHaveRootWrapper?: boolean;
  parentEntryType?: string;
  nonBFMappedGroup?: NonBFMappedGroup;
};

export interface ISchemaTraverser {
  init: (params: {
    schema: Map<string, SchemaEntry>;
    userValues: UserValues;
    selectedEntries: string[];
    initialContainer: Record<string, any>;
  }) => ISchemaTraverser;
  traverse: (params: TraverseSchemaParams) => void;
}
