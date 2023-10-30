type RecordID = string | number | undefined;

type SavedRecordData = Record<string, object> | RecordEntry;

type LocallySavedRecord = {
  createdAt: number;
  data: SavedRecordData;
};

type PreviewContent = {
  id: string;
  base: Map<string, any>;
  userValues: UserValues;
  initKey: string;
};
