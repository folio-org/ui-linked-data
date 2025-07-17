type CommonParams = {
  id: string;
  contact?: string;
  remark?: string;
};

type BibframeProfile = CommonParams & {
  author: string;
  title: string;
  description: string;
  date: string;
  resourceTemplates: Array<ResourceTemplate>;
};

type ResourceTemplate = CommonParams & {
  resourceURI: string;
  resourceLabel: string;
  propertyTemplates: PropertyTemplate[];
};

type PropertyLayout<T> = {
  isNew?: T;
  readOnly?: T;
  api?: string;
  baseLabelType?: string;
};

type PropertyTemplate = Omit<CommonParams, 'contact'> & {
  propertyURI: string;
  propertyLabel: string;
  mandatory: boolean;
  repeatable: boolean;
  type: string | URL; // "literal" | "resource"
  valueConstraint: ValueConstraint;
  layout?: PropertyLayout<string>;
  dependsOn?: string;
};

type PropertyTemplateUserValue = PropertyTemplate & {
  userValue?: {
    '@type': string;
    '@value': string | undefined;
  };
};

type ValueConstraint = {
  valueLanguage: string;
  languageURI: string;
  languageLabel: string;
  valueDataType: ValueDataType;
  valueTemplateRefs: Array<string>;
  useValuesFrom: Array<string>;
  editable: boolean;
  remark: string;
};

type ValueDataType = {
  dataTypeURI: string;
  dataTypeLabel: string;
  dataTypeLabelHint: string;
  remark: string;
};

type FieldType = 'META' | 'HIDE' | 'REF' | 'LITERAL' | 'SIMPLE' | 'COMPLEX' | 'UNKNOWN';

type ProfileMetadata = {
  createDate: string;
  updateDate: string;
  updateUser: string;
};

type ProfileEntry = {
  configType: string;
  created: string;
  id: string;
  json: {
    Profile: BibframeProfile;
  };
  metadata: ProfileMetadata;
  modified: string;
  name: string;
};

type RecursiveRecordSchema = {
  [key: string]: string[] | number[] | number | string | RecursiveRecordSchema;
};

type RecordEntry<T = RecursiveRecordSchema> = {
  [key: string]: {
    [key: string]: T;
  };
};

interface ResourceTemplates {
  [key: string]: ResourceTemplate;
}

// TODO: define type and format for data received from API
type RecordData = {
  id?: number | string;
  label?: string;
};

type DropdownOptionSelection = {
  hasNoRootWrapper: boolean;
  isSelectedOption: boolean;
  setIsSelectedOption: (value: boolean) => boolean;
  selectedRecordUriBFLite?: string;
  selectedOptionUriBFLite?: string;
};

type LookupValue = string | Record<string, (string | undefined)[] | string | Nullish> | Nullish;

type NonBFMappedGroupData = {
  container: { key?: string; altKeys?: Record<string, string> };
  options?: {
    [key: string]: { key?: string };
  };
  [key: string]: { key: string };
};

type NonBFMappedGroup = {
  uri: string;
  data: NonBFMappedGroupData;
};

type FieldTypeMapDataValue = {
  uri: string;
  parentBlock?: {
    bfLiteUri?: string;
  };
};

type FieldTypeMapDataEntry = {
  [key: string]: FieldTypeMapDataValue;
};

type FieldTypeMapEntry = {
  field: string | { uri: string };
  data: FieldTypeMapDataEntry;
  fields?: FieldTypeMap;
};

type FieldTypeMap = Record<string, FieldTypeMapEntry>;

type BF2BFLiteMapOptions = Record<string, { bf2Uri: string }>;

type BF2BFLiteMapFields = Record<string, { bf2Uri: string; label?: string }>;

type BF2BFLiteMapEntry = {
  container: { bf2Uri: string; dataTypeUri?: string };
  options?: BF2BFLiteMapOptions;
  fields?: BF2BFLiteMapFields;
};

type BF2BFLiteMap = Record<string, Record<string, BF2BFLiteMapEntry>>;

type ProfileComponent = ProfileEntry | ResourceTemplate | PropertyTemplate;

type ResourceType = keyof typeof import('@common/constants/record.constants').ResourceType;
