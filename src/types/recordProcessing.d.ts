type UserValueDTO = {
  data: string | string[] | Record<string, string[]> | Record<string, string[]>[];
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

type RecordProcessingCreatorDTO = {
  [key: string]: Record<string, Record<string, string[] | RecordBasic[]>>;
}[];

type RecordWithNestedFieldsDTO = { [key: string]: string }[];

type RecordForComplexGroupsDTO = { [key: string]: string[] }[];
