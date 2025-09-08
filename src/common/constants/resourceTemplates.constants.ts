import { BFLITE_URIS } from './bibframeMapping.constants';

export const DUPLICATE_RESOURCE_TEMPLATE: Record<string, ResourceTemplateMetadata[]> = {
  [BFLITE_URIS.INSTANCE]: [
    {
      path: [
        BFLITE_URIS.INSTANCE,
        'http://bibfra.me/vocab/library/title',
        'http://bibfra.me/vocab/library/Title',
        'http://bibfra.me/vocab/library/mainTitle',
      ],
      template: {
        prefix: 'ld.duplicateInstanceInBrackets',
      },
    },
  ],
  [BFLITE_URIS.WORK]: [
    {
      path: [
        BFLITE_URIS.WORK,
        'http://bibfra.me/vocab/library/title',
        'http://bibfra.me/vocab/library/Title',
        'http://bibfra.me/vocab/library/mainTitle',
      ],
      template: {
        prefix: 'ld.duplicateWorkInBrackets',
      },
    },
  ],
};
