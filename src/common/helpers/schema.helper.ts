import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import { BFLITE_LABELS_MAP, BFLITE_URIS } from '@common/constants/bibframeMapping.constants';
import { IS_NEW_API_ENABLED } from '@common/constants/feature.constants';

export const getLookupLabelKey = (uriBFLite?: string) => {
  const typedUriBFLite = uriBFLite as keyof typeof BFLITE_LABELS_MAP;

  return uriBFLite ? BFLITE_LABELS_MAP[typedUriBFLite] || BFLITE_URIS.LABEL : BFLITE_URIS.TERM;
};

export const generateUserValueObject = (entry: any, type: AdvancedFieldType, uriBFLite?: string) => {
  const keyName = getLookupLabelKey(uriBFLite);
  const { uri: entryUri, label: entryLabel } = entry;
  const uri = IS_NEW_API_ENABLED ? BFLITE_URIS.LINK : entryUri;
  let label = entryLabel;

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

export const getSelectedRecord = (uriWithSelector: string, record?: Record<string, any> | Array<any>) =>
  Array.isArray(record)
    ? record?.find(entry => Object.keys(entry).includes(uriWithSelector))?.[uriWithSelector]
    : record?.[uriWithSelector];

export const generateRecordForDropdown = ({
  record,
  uriWithSelector,
  hasRootWrapper,
}: {
  record?: Record<string, any> | Array<any>;
  uriWithSelector: string;
  hasRootWrapper: boolean;
}) => (hasRootWrapper ? getSelectedRecord(uriWithSelector, record) : record);
