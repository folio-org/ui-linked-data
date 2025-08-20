interface ProfileWarningMap {
  [fromProfileName: string]: {
    [toProfileName: string]: string[];
  };
}

export const profileWarningsByName = {
  Monograph: {
    Serials: ['ld.na'],
    'Rare Books': ['ld.field.urlOfInstance'],
  },
  'Rare Books': {
    Monograph: ['ld.field.bookFormat'],
    Serials: ['ld.field.bookFormat'],
  },
  Serials: {
    Monograph: ['ld.field.frequency'],
    'Rare Books': ['ld.field.urlOfInstance', 'ld.field.frequency'],
  },
} as ProfileWarningMap;
