export const PROFILES_CONFIG = {
  Monograph: {
    api: {
      profile: '1',
      work: '2',
      instance: '3',
    },
    rootEntry: {
      type: 'profile',
      displayName: 'Monograph',
      bfid: 'monograph',
      children: ['Monograph:Work', 'Monograph:Instance'],
      id: 'Monograph',
    },
  },
};
