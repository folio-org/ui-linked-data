type UserValueDTO = {
  data: string | string[] | RecordBasic | RecordBasic[];
  id?: string;
  uri?: string;
  uuid?: string;
  labelSelector?: string;
  uriSelector?: string;
  type?: AdvancedFieldType;
  propertyUri?: string;
  blockUri?: string;
  groupUri?: string;
  fieldUri?: string;
};

type RecordNormalizingCasesMap = Record<
  string,
  {
    process: (record: RecordEntry, blockKey: string, groupKey: string) => void;
  }
>;

type RecordBasic = Record<string, string[]>;

type RecordProcessingDTO = Record<string, Record<string, string[] | RecordBasic[]>>[];

type RecordWithNestedFieldsDTO = { [key: string]: string }[];

type RecordForComplexGroupsDTO = { [key: string]: string[] }[];

type ICommonStatus = {
  set: (l10nId: string, type: StatusType) => void;
};

type DefaultGroupValues = {
  [x: string]: {
    value: string;
  };
};

type RecordEntryValue = string | string[] | RecordBasic[];
