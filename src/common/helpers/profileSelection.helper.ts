import { profileWarningsByName } from '@/configs';
import { getProfileLabelId, getResourceTypeFromURL } from '@/configs/resourceTypes';

/**
 * Generic, type-agnostic translation ids for the profile-selection modal.
 * Each message uses a `{type}` placeholder filled with the resource-type name,
 * so adding a new resource type requires no new label keys here.
 */
export const PROFILE_SELECTION_LABEL_IDS = {
  titleSet: 'ld.newType',
  titleChange: 'ld.changeTypeProfile',
  select: 'ld.modal.chooseResourceProfile.typeProfile',
  setAsDefault: 'ld.setDefaultTypeProfile',
  submitSet: 'ld.create.base',
  submitChange: 'ld.change',
} as const;

/**
 * Returns the translation id for the human-readable resource-type name
 * (e.g. 'ld.work', 'ld.authority') resolved from a resource-type URL. Used to
 * fill the `{type}` placeholder in profile-selection labels.
 */
export const getResourceTypeLabelId = (resourceTypeURL?: ResourceTypeURL): string =>
  getProfileLabelId(getResourceTypeFromURL(resourceTypeURL ?? null));

/**
 * Resolves the modal title and submit-button translation ids for a given
 * profile-selection action.
 */
export const getProfileSelectionMessageIds = ({ action }: ProfileSelectionType) => ({
  titleId: action === 'set' ? PROFILE_SELECTION_LABEL_IDS.titleSet : PROFILE_SELECTION_LABEL_IDS.titleChange,
  submitId: action === 'set' ? PROFILE_SELECTION_LABEL_IDS.submitSet : PROFILE_SELECTION_LABEL_IDS.submitChange,
});

export const getWarningByProfileNames = (
  resourceTypeURL: ResourceTypeURL,
  fromProfileName: string,
  toProfileName: string,
) => {
  return profileWarningsByName[resourceTypeURL]?.[fromProfileName]?.[toProfileName] || null;
};

export const isProfilePreferred = ({
  profileId,
  preferredProfiles,
  resourceTypeURL,
}: {
  profileId: string | number;
  preferredProfiles?: ProfileDTO[];
  resourceTypeURL?: ResourceTypeURL;
}) => {
  if (!profileId || !preferredProfiles || !resourceTypeURL) return false;

  return preferredProfiles.some(
    ({ id, resourceType }) => id?.toString() === profileId?.toString() && resourceType === resourceTypeURL,
  );
};
