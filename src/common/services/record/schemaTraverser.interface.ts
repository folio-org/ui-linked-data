export type Container = Record<string, any>;

export type InitSchemaParams = {
  schema: Map<string, SchemaEntry>;
  userValues: UserValues;
  selectedEntries: string[];
  initialContainer: Container;
};

export type TraverseSchemaParams = {
  container?: Container;
  key: string;
  index?: number;
  shouldHaveRootWrapper?: boolean;
  parentEntryType?: string;
  nonBFMappedGroup?: NonBFMappedGroup;
};

export interface ISchemaTraverser {
  init: (params: InitSchemaParams) => ISchemaTraverser;
  traverse: (params: TraverseSchemaParams) => void;
}
