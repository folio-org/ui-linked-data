type RecordStatusType = keyof typeof import('@common/constants/record.constants').RecordStatus;

type RecordID = string | number | undefined;

type ParsedRecord = Record<string, Record<string, RecursiveRecordSchema[]>> | RecordEntry | RecursiveRecordSchema;

type LocallySavedRecord = {
  createdAt: number;
  data: ParsedRecord;
};

type PreviewContent = {
  id: string;
  base: Map<string, any>;
  userValues: UserValues;
  initKey: string;
  title?: string;
  entities?: string[];
};

type RecordReference = {
  key: string;
  uri: string;
};

type RecordBlocksBFLite = Record<
  string,
  {
    uri: string;
    reference: RecordReference;
  }
>;

type SelectedRecordBlocks = {
  block?: string;
  reference?: RecordReference;
};

type RecordBlocksList = string[];

type RecordStatus = {
  type?: SavingStatusType;
};

type UserValueTemplate = {
  prefix?: string;
};

type ResourceTemplateMetadata = {
  path: string[];
  template: UserValueTemplate;
};
