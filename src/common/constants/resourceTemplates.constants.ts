import { BFLITE_URIS } from './bibframeMapping.constants';

export const DUPLICATE_RESOURCE_TEMPLATE: Record<string, ResourceTemplateMetadata[]> = {
  [BFLITE_URIS.INSTANCE]: [
    {
      path: [BFLITE_URIS.INSTANCE, BFLITE_URIS.TITLE, BFLITE_URIS.TITLE_CONTAINER, BFLITE_URIS.MAIN_TITLE],
      template: {
        prefix: 'ld.duplicateInstanceInBrackets',
      },
    },
  ],
  [BFLITE_URIS.WORK]: [
    {
      path: [BFLITE_URIS.WORK, BFLITE_URIS.TITLE, BFLITE_URIS.TITLE_CONTAINER, BFLITE_URIS.MAIN_TITLE],
      template: {
        prefix: 'ld.duplicateWorkInBrackets',
      },
    },
  ],
  [BFLITE_URIS.HUB]: [
    {
      path: [BFLITE_URIS.HUB, BFLITE_URIS.TITLE, BFLITE_URIS.TITLE_CONTAINER, BFLITE_URIS.MAIN_TITLE],
      template: {
        prefix: 'ld.duplicateHubInBrackets',
      },
    },
  ],
  [BFLITE_URIS.AUTHORITY]: [
    {
      path: [BFLITE_URIS.AUTHORITY, BFLITE_URIS.NAME],
      template: {
        prefix: 'ld.duplicateAuthorityInBrackets',
      },
    },
  ],
};
