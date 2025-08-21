type ProfileType = 'Monograph';

type ProfileNode = {
  type: string;
  displayName: string;
  bfid?: string;
  uri?: string;
  uriBFLite?: string;
  groupName?: string;
  children?: string[];
  id: string;
  uuid: string;
  path: string[];
  constraints?: Constraints;
  layout?: PropertyLayout<boolean>;
  linkedEntry?: LinkedEntry;
  dependsOn?: string;
  deletable?: boolean;
  cloneIndex?: number;
};

type Profile = ProfileNode[];

type ProfileDTO = {
  id: string | number;
  name: string;
  resourceType: string;
};
