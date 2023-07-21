type RecordID = string | number | undefined;

type LocallySavedRecord = {
  createdAt: number;
  data: RecursiveRecordSchema;
};
