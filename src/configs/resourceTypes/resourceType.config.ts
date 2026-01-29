import { BFLITE_URIS } from '@/common/constants/bibframeMapping.constants';
import { ResourceType } from '@/common/constants/record.constants';

import { type ResourceTypeRegistry } from './resourceType.types';

export const RESOURCE_TYPE_REGISTRY: ResourceTypeRegistry = {
  [ResourceType.instance]: {
    type: ResourceType.instance,
    uri: BFLITE_URIS.INSTANCE,
    profileBfid: 'lde:Profile:Instance',
    defaultProfileId: 3,
    profileChildren: ['Profile:Work', 'Profile:Instance'],
    dependencies: [ResourceType.work],
    ui: {
      hasPreview: true,
      editSectionPassiveClass: undefined,
      editPageLayout: 'split',
      previewPosition: 'left',
    },
    reference: {
      key: '_workReference',
      uri: BFLITE_URIS.WORK,
      targetType: ResourceType.work,
    },
    labelId: 'ld.instance',
  },

  [ResourceType.work]: {
    type: ResourceType.work,
    uri: BFLITE_URIS.WORK,
    profileBfid: 'lde:Profile:Work',
    defaultProfileId: 2,
    profileChildren: ['Profile:Work', 'Profile:Instance'],
    dependencies: [ResourceType.instance],
    ui: {
      hasPreview: true,
      editSectionPassiveClass: 'edit-section-passive',
      editPageLayout: 'split',
      previewPosition: 'right',
    },
    reference: {
      key: '_instanceReference',
      uri: BFLITE_URIS.INSTANCE,
      targetType: ResourceType.instance,
    },
    labelId: 'ld.work',
  },

  [ResourceType.hub]: {
    type: ResourceType.hub,
    uri: BFLITE_URIS.HUB,
    profileBfid: 'lde:Profile:Hub',
    defaultProfileId: 7,
    profileChildren: ['Profile:Hub'],
    dependencies: [],
    ui: {
      hasPreview: false,
      editPageLayout: 'single',
    },
    labelId: 'ld.hub',
  },
};
