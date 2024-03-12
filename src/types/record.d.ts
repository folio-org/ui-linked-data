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
};

type RecordBlocks = Record<
  string,
  {
    uri: string;
    reference: {
      key: string;
      uri: string;
    };
  }
>;
