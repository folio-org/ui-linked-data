export interface IEntryPropertiesGeneratorService {
  addEntryWithHtmlId: (uuid: string) => void;

  applyHtmlIdToEntries: (schema: Schema) => void;
}
