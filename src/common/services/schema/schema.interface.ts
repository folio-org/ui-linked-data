export interface ISchema {
  init: (templates: ResourceTemplates, entry: ProfileEntry | ResourceTemplate | PropertyTemplate) => void;

  get: () => Schema;

  generate: (initKey: string) => void;
}
