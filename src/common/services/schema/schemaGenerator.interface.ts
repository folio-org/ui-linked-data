export interface ISchemaGenerator {
  init: (profile: Profile) => void;

  get: () => Schema;

  generate: (initKey: string) => void;
}
