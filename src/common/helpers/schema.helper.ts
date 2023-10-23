import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import { BFLITE_LABELS_MAP, BFLITE_URIS, ADVANCED_FIELDS } from '@common/constants/bibframeMapping.constants';

export const getLookupLabelKey = (uriBFLite?: string) => {
  const typedUriBFLite = uriBFLite as keyof typeof BFLITE_LABELS_MAP;

  return uriBFLite ? BFLITE_LABELS_MAP[typedUriBFLite] || BFLITE_URIS.LABEL : BFLITE_URIS.TERM;
};

export const getAdvancedValuesField = (uriBFLite?: string) => {
  const typedUriBFLite = uriBFLite as keyof typeof ADVANCED_FIELDS;

  return uriBFLite ? ADVANCED_FIELDS[typedUriBFLite]?.valueUri : undefined;
};

export const generateAdvancedFieldObject = ({
  advancedValueField,
  label,
}: {
  advancedValueField?: string;
  label?: string;
}) => (advancedValueField && label ? { [advancedValueField]: [label] } : undefined);

export const generateUserValueObject = (entry: any, type: AdvancedFieldType, uriBFLite?: string) => {
  const keyName = getLookupLabelKey(uriBFLite);
  const advancedValueField = getAdvancedValuesField(uriBFLite);
  const labelKeyName = advancedValueField || keyName;
  const uri = BFLITE_URIS.LINK;
  const label = Array.isArray(entry[labelKeyName]) ? entry[labelKeyName][0] : entry[labelKeyName];

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
