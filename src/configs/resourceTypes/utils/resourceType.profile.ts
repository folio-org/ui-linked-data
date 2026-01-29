import { type ResourceTypeInput, getResourceTypeConfig } from './resourceType.accessors';

/**
 * Create the root entry for a resource type's profile.
 * Returns a partial ProfileNode that will be completed by the schema generator.
 */
export const createRootEntry = (
  type: ResourceTypeInput,
): Pick<ProfileNode, 'type' | 'displayName' | 'bfid' | 'children' | 'id'> => {
  const config = getResourceTypeConfig(type);

  return {
    type: 'profile',
    displayName: 'Profile',
    bfid: 'lde:Profile',
    children: config.profileChildren,
    id: 'Profile',
  };
};
