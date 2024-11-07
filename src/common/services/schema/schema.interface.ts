export interface ISchema {
  init: (templates: ResourceTemplates, entry: ProfileComponent) => void;

  get: () => Schema;

  generate: (initKey: string) => void;
}
