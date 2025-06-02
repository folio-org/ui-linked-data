// This will probably change in the future to something smaller than 50MiB
export const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024 * 1024;

export const HOLD_LOADING_SCREEN_MS = 2.5 * 1000;

export enum ImportModes {
  JsonFile = 'jsonfile',
  JsonUrl = 'jsonurl',
}
