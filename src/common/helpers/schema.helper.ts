import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import { BFLITE_LABELS_MAP, BFLITE_URIS } from '@common/constants/bibframeMapping.constants';
import { IS_NEW_API_ENABLED } from '@common/constants/feature.constants';

export const getLookupLabelKey = (uriBFLite: string | undefined) => {
  const typedUriBFLite = uriBFLite as keyof typeof BFLITE_LABELS_MAP;

  return uriBFLite ? BFLITE_LABELS_MAP[typedUriBFLite] || BFLITE_URIS.LABEL : BFLITE_URIS.TERM;
};

export const generateUserValueObject = (entry: any, type: AdvancedFieldType, uriBFLite: string | undefined) => {
  const keyName = getLookupLabelKey(uriBFLite);
  const { uri: entryUri, label: entryLabel } = entry;
  const uri = IS_NEW_API_ENABLED ? BFLITE_URIS.LINK : entryLabel;
  let label = entryUri;

  if (IS_NEW_API_ENABLED) {
    label = Array.isArray(entry[keyName]) ? entry[keyName][0] : entry[keyName];
  }

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
