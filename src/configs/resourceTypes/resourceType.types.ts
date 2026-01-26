import { ResourceType } from '@/common/constants/record.constants';

export interface ResourceTypeUIConfig {
  hasPreview: boolean;
  editSectionPassiveClass?: string;
  editPageLayout?: 'single' | 'split';
  previewPosition?: 'left' | 'right';
}

export interface ResourceTypeReference {
  key: string;
  uri: string;
  targetType: ResourceType;
}

export interface ResourceTypeDefinition {
  type: ResourceType;
  uri: string;
  profileBfid: string;
  defaultProfileId: number;
  profileChildren: string[];
  dependencies: ResourceType[];
  ui: ResourceTypeUIConfig;
  reference?: ResourceTypeReference;
  labelId: string;
}

export type ResourceTypeRegistry = Record<ResourceType, ResourceTypeDefinition>;
