import { profileWarningsByName } from '@src/configs';

export const getLabelId = ({
  labels: { workSet, instanceSet, workChange, instanceChange, defaultLabel },
  profileSelectionType: { action, resourceType },
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
  let labelId;

  if (action === 'set') {
    labelId = resourceType === 'work' ? workSet : instanceSet;
  } else if (action === 'change') {
    labelId = resourceType === 'work' ? workChange : instanceChange;
  } else {
    labelId = defaultLabel;
  }

  return labelId;
};

export const getWarningByProfileNames = (fromProfileName: string, toProfileName: string) => {
  return profileWarningsByName[fromProfileName]?.[toProfileName] || null;
};
