import { BFLITE_TYPES_MAP, BFLITE_URIS, DEFAULT_GROUP_VALUES } from '@/common/constants/bibframeMapping.constants';
import { filterLookupOptionsByMappedValue } from '@/common/helpers/lookupOptions.helper';

import { logger } from '../../logger';
import { UserValueType } from './userValueType';
import { IUserValueType } from './userValueType.interface';

export class SimpleLookupUserValueService extends UserValueType implements IUserValueType {
  private loadedData?: MultiselectOption[];
  private contents?: UserValueContents[];

  constructor(private readonly loadLookup: (uri: string) => Promise<MultiselectOption[]>) {
    super();
  }

  async generate({ data, uri, uuid, uriSelector, type, propertyUri, groupUri, fieldUri }: UserValueDTO) {
    try {
      const allOptions = await this.loadLookup(uri as string);

      this.loadedData = filterLookupOptionsByMappedValue(allOptions, propertyUri, groupUri);
    } catch (error) {
      logger.error('Lookup fetch failed — generate() continues with record labels only', error);
      this.loadedData = [];
    }

    this.contents = [];

    if (Array.isArray(data)) {
      for (const dataEntry of data as RecordBasic[]) {
        const itemUri = dataEntry[uriSelector as string]?.[0];

        if (!this.checkDefaultGroupValues(groupUri, itemUri)) {
          this.generateContentItem({
            label: this.extractLabel(dataEntry),
            itemUri,
            uri,
            groupUri,
            type,
            fieldUri,
          });
        }
      }
    } else {
      const typedData = data as RecordBasic;
      const itemUri = typedData[uriSelector as string]?.[0];

      if (!this.checkDefaultGroupValues(groupUri, itemUri)) {
        this.generateContentItem({
          label: this.extractLabel(typedData),
          itemUri,
          uri,
          groupUri,
          type,
          fieldUri,
        });
      }
    }

    this.value = {
      uuid: uuid ?? '',
      contents: this.contents,
    };

    return this.value;
  }

  private extractLabel(dataEntry: RecordBasic): string | undefined {
    const nameField = dataEntry[BFLITE_URIS.NAME]?.[0];

    if (nameField !== undefined) {
      return nameField;
    }

    const labelField = dataEntry[BFLITE_URIS.LABEL]?.[0];

    if (labelField !== undefined) {
      return labelField;
    }

    const termField = dataEntry[BFLITE_URIS.TERM]?.[0];

    if (termField !== undefined) {
      return termField;
    }

    return undefined;
  }

  private checkDefaultGroupValues(groupUri?: string, itemUri?: string) {
    if (!groupUri || !itemUri) return false;

    return (DEFAULT_GROUP_VALUES as DefaultGroupValues)[groupUri]?.value === itemUri;
  }

  private generateContentItem({
    label,
    itemUri,
    uri,
    groupUri,
    type,
    fieldUri,
  }: {
    label?: string;
    itemUri?: string;
    uri?: string;
    groupUri?: string;
    type?: AdvancedFieldType;
    fieldUri?: string;
  }) {
    const typesMap = (BFLITE_TYPES_MAP as FieldTypeMap)[groupUri as string];
    const mappedUri =
      typesMap && itemUri
        ? typesMap?.data?.[itemUri]?.uri || typesMap?.fields?.[fieldUri as string]?.data?.[itemUri]?.uri
        : itemUri;

    // Check if the loaded options contain a value from the record
    const loadedOption = this.loadedData?.find(
      ({ label: optionLabel, value }) =>
        value.uri === mappedUri || (label && value.label === label) || (label && optionLabel === label),
    );

    // Use a default empty string if label is undefined
    const safeLabel = label || '';
    const selectedLabel = typesMap && itemUri ? (loadedOption?.label ?? itemUri) : (loadedOption?.label ?? safeLabel);

    const contentItem = {
      label: selectedLabel,
      meta: {
        parentUri: uri,
        uri: itemUri,
        type,
        basicLabel: loadedOption?.value.label,
      },
    };

    this.contents?.push(contentItem);
  }
}
