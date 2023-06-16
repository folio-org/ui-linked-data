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
  resourceURI: URL | string;
  resourceLabel: string;
  propertyTemplates: Array<>;
};

type PropertyTemplate = Omit<CommonParams, 'contact'> & {
  propertyURI: URL | string;
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
  useValuesFrom: Array<URL | string>;
  editable: boolean;
  remark: string;
};

type ValueDataType = {
  dataTypeURI: string;
  dataTypeLabel: string;
  dataTypeLabelHint: string;
  remark: string;
};

type FieldType = 'META' | 'HIDE' | 'REF' | 'LITERAL' | 'SIMPLE' | 'COMPLEX';
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

type RecordEntry = {
  id?: number;
  graphName: string;
  configuration: {
    workValues: Array<PropertyTemplate>;
    instanceValues: Array<PropertyTemplate>;
  };
};
