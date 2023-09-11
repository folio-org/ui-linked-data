import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import { BFLITE_URIS } from '@common/constants/bibframeMapping.constants';
import { IS_NEW_API_ENABLED } from '@common/constants/feature.constants';
import { getLookupLabelKey } from './profile.helper';

export const generateUserValueObject = (entry: any, type: AdvancedFieldType, uriBFLite: string | undefined) => {
  const keyName = getLookupLabelKey(uriBFLite);
  const label = IS_NEW_API_ENABLED ? entry[keyName] : entry.uri;
  const uri = IS_NEW_API_ENABLED ? BFLITE_URIS.LINK : entry.label;

  return {
    label,
    meta: {
      parentURI: uri,
      uri,
      type,
    },
  };
};

export const generateRecordForDropdown = ({
  record,
  uriWithSelector,
  hasNoRootWrapper,
}: {
  record: Record<string, any> | Array<any> | undefined;
  uriWithSelector: string;
  hasNoRootWrapper: boolean;
}) => {
  const isRecordArray = Array.isArray(record);
  let recordData;

  if (hasNoRootWrapper) {
    recordData = record;
  } else {
    recordData = isRecordArray
      ? record.find(entry => Object.keys(entry).includes(uriWithSelector))?.[uriWithSelector]
      : record?.[uriWithSelector];
  }

  return recordData;
};
