type UserValueContents = {
  id?: string;
  label?: string;
  meta?: {
    uri?: string;
    parentUri?: string;
    type?: string;
    bfLabel?: string;
    basicLabel?: string;
    srsId?: string;
    isPreferred?: boolean;
    sourceType?: string;
    lookupType?: string;
  };
};

type UserValue = {
  uuid: string;
  contents: Array<UserValueContents>;
  template?: UserValueTemplate;
};

type UserValues = Record<string, UserValue>;

type RenderedFieldMap = Map<string, RenderedField>;

type AdvancedFieldType =
  | FieldType
  | 'profile' // Monograph
  | 'block' // Work, Instance, Item
  | 'group' // TBD
  | 'groupComplex'
  | 'hidden'
  | 'dropdown'
  | 'enumerated'
  | 'dropdownOption';

type RenderedFieldValue = {
  uri?: string;
  value?: string;
};

type RenderedField = {
  type: AdvancedFieldType;
  fields?: RenderedFieldMap;
  path: string;
  name?: string;
  uri?: string;
  value?: RenderedFieldValue[];
  id?: string;
};

type PreviewMap = Map<string, PreviewBlock>;

type PreviewBlock = {
  title: string;
  groups: Map<string, PreviewGroup>;
};

type PreviewGroup = {
  title: string;
  value: PreviewFieldValue[];
};

type PreviewFieldValue = Partial<RenderedFieldValue> & { field: string };

type PreviewBlockSortValues = {
  [key: string]: number;
};

type Constraints = {
  mandatory: boolean;
  repeatable: boolean;
  editable: boolean;
  defaults: Array<any>;
  useValuesFrom: Array<string>;
  valueDataType: {
    dataTypeURI: string;
  };
};

type SchemaEntry = {
  path: string[];
  uuid: string;
  bfid?: string;
  uri?: string;
  uriBFLite?: string;
  displayName?: string;
  type?: string;
  children?: string[];
  constraints?: Constraints;
  cloneOf?: string;
  clonedBy?: string[];
  layout?: PropertyLayout<boolean>;
  dependsOn?: string;
  linkedEntry?: LinkedEntry;
  htmlId?: string;
  cloneIndex?: number;
  twinChildren?: Record<string, string[]>;
  deletable?: boolean;
  profileId?: string | number | null;
  marc?: string;
  marcMapping?: Record<string, string>;
  editorVisible?: boolean;
  profileSettingsDrift?: boolean;
};

type LinkedEntry = {
  controlledBy?: string;
  dependent?: string;
};

type SelectableUserValue = {
  uuid: string;
  values: Array<{
    uri: string | null;
    label: string;
  }>;
};

type UserValue = {
  uuid: string;
  values: Array<string>;
};

type Schema = Map<string, SchemaEntry>;

type BFMapEntry = Record<string, string>;

type BFLiteMap = Record<string, string | BFMapEntry>;

type IconType = {
  className?: string;
};

type AbstractIntlFormatter = ({ id: string }) => string;
