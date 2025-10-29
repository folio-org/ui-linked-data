import { TYPE_URIS } from '@common/constants/bibframe.constants';

type ProfileWarningMap = {
  [resourceTypeURL in ResourceTypeURL]: {
    [fromProfileName: string]: {
      [toProfileName: string]: string[];
    };
  };
};

export const profileWarningsByName = {
  [TYPE_URIS.WORK as ResourceTypeURL]: {
    'Serials Work': {
      Books: ['ld.field.typeOfContinuingResource'],
    },
    Books: {
      'Serials Work': ['ld.na'],
    },
  },
  [TYPE_URIS.INSTANCE as ResourceTypeURL]: {
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
  },
} as unknown as ProfileWarningMap;
