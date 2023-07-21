type RecordID = string | number | undefined;

type SavedRecordData = Record<string, object>;

type LocallySavedRecord = {
  createdAt: number;
  data: SavedRecordData;
};
