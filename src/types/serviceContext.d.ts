type ISelectedEntries = import('@common/services/selectedEntries/selectedEntries.interface').ISelectedEntries;
type IUserValues = import('@common/services/userValues/userValues.interface').IUserValues;

type ServicesParams = {
  selectedEntriesService?: ISelectedEntries;
  userValuesService?: IUserValues;
};
