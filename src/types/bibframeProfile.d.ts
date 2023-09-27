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

type PropertyTemplate = Omit<CommonParams, 'contact'> & {
  propertyURI: string;
  propertyLabel: string;
  mandatory: boolean;
  repeatable: boolean;
  type: string | URL; // "literal" | "resource"
  valueConstraint: ValueConstraint;
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

type RecursiveRecordSchema = Record<string, Array<RecursiveRecordSchema | string>>;

type RecordEntryDeprecated = RecursiveRecordSchema & {
  id?: number | string;
  profile: string;
};

type RecordEntry = RecursiveRecordSchema;

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
};

type LookupValue = string | Record<string, (string | undefined)[] | string | Nullish> | Nullish;
