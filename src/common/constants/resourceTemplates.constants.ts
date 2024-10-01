import { BFLITE_URIS } from './bibframeMapping.constants';

export const DUPLICATE_RESOURCE_TEMPLATE: Record<string, ResourceTemplateMetadata[]> = {
  [BFLITE_URIS.INSTANCE]: [
    {
      path: [
        BFLITE_URIS.INSTANCE,
        'http://bibfra.me/vocab/marc/title',
        'http://bibfra.me/vocab/marc/Title',
        'http://bibfra.me/vocab/marc/mainTitle',
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
        'http://bibfra.me/vocab/marc/title',
        'http://bibfra.me/vocab/marc/Title',
        'http://bibfra.me/vocab/marc/mainTitle',
      ],
      template: {
        prefix: 'ld.duplicateWorkInBrackets',
      },
    },
  ],
};
