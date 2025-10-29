import { TYPE_URIS } from '@common/constants/bibframe.constants';
import { profileWarningsByName } from '@src/configs';

export const getLabelId = ({
  labels: { workSet, instanceSet, workChange, instanceChange, defaultLabel },
  profileSelectionType: { action, resourceTypeURL },
}: {
  labels: {
    workSet?: string;
    instanceSet?: string;
    workChange?: string;
    instanceChange?: string;
    defaultLabel: string;
  };
  profileSelectionType: ProfileSelectionType;
}) => {
  const isWorkResourceType = resourceTypeURL === TYPE_URIS.WORK;
  let labelId;

  if (action === 'set') {
    labelId = isWorkResourceType ? workSet : instanceSet;
  } else if (action === 'change') {
    labelId = isWorkResourceType ? workChange : instanceChange;
  } else {
    labelId = defaultLabel;
  }

  return labelId;
};

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
  if (!preferredProfiles || !resourceTypeURL) return false;

  return preferredProfiles.some(
    ({ id, resourceType }) => id.toString() === profileId.toString() && resourceType === resourceTypeURL,
  );
};
