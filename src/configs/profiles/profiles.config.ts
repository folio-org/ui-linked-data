export const PROFILE_CONFIG = {
  // TODO: UILD-438 - Remove hardcoded profile IDs and names after implementing profile selection for Work
  defaultProfileIds: {
    work: 2,
    instance: 3,
  },
  rootEntry: {
    type: 'profile',
    displayName: 'Profile',
    bfid: 'lde:Profile',
    children: ['Profile:Work', 'Profile:Instance'],
    id: 'Profile',
  },
};
