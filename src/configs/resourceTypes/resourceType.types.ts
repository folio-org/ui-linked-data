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

export interface ResourceTypeSearchConfig {
  segment: string;
}

export interface ResourceTypeDefinition {
  type: ResourceType;
  uri: string;
  /**
   * Canonical resource-type URI used to identify the resource type for profile
   * selection and profile fetching. Defaults to `uri` when omitted. This is kept
   * separate from `uri` because some types (e.g. authority) use an internal token
   * (`_authority`) for record processing/generation while the real BIBFRAME URI is
   * used to define the resource type.
   */
  resourceTypeUri?: string;
  profileBfid: string;
  defaultProfileId: number;
  profileChildren: string[];
  dependencies: ResourceType[];
  ui: ResourceTypeUIConfig;
  reference?: ResourceTypeReference;
  labelId: string;
  search: ResourceTypeSearchConfig;
}

export type ResourceTypeRegistry = Record<ResourceType, ResourceTypeDefinition>;
