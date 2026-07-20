export type ProcessedResource = {
  schema: Schema;
  userValues: UserValues;
  initKey: string;
  selectedEntries: string[];
  selectedRecordBlocks?: SelectedRecordBlocks;
  selectedProfile?: Profile;
  selectedProfileSettingsId?: string | number;
  title?: string;
  entities?: string[];
  referenceIds?: { id: unknown }[];
};
