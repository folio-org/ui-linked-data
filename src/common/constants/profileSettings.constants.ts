export const DEFAULT_INACTIVE_SETTINGS: ProfileSettingsWithDrift = {
  active: false,
  children: [],
  missingFromSettings: [],
};

export const PROFILE_SETTINGS_DEFAULT_OPTION = 'default';

export const BASE_SETTINGS_OPTIONS = [
  {
    label: '',
    value: '',
  },
];

export enum ProfileSettingsMode {
  Landing = 'landing',
  Creating = 'creating',
  Editing = 'editing',
}
