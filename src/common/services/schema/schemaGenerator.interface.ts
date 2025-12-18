export interface ISchemaGenerator {
  init: (profile: Profile, settings: ProfileSettingsWithDrift) => void;

  get: () => Schema;

  generate: (initKey: string) => void;
}
