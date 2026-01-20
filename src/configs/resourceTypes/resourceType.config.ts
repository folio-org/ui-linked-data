import { ResourceType } from '@/common/constants/record.constants';
import { type ResourceTypeRegistry } from './resourceType.types';

export const RESOURCE_TYPE_REGISTRY: Pick<ResourceTypeRegistry, ResourceType.work | ResourceType.instance> = {
  [ResourceType.instance]: {
    type: ResourceType.instance,
    uri: 'http://bibfra.me/vocab/lite/Instance',
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
      uri: 'http://bibfra.me/vocab/lite/Work',
      targetType: ResourceType.work,
    },
  },

  [ResourceType.work]: {
    type: ResourceType.work,
    uri: 'http://bibfra.me/vocab/lite/Work',
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
      uri: 'http://bibfra.me/vocab/lite/Instance',
      targetType: ResourceType.instance,
    },
  },
};
