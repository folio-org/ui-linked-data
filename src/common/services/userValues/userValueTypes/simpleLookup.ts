import { filterLookupOptionsByMappedValue, formatLookupOptions } from '@common/helpers/lookupOptions.helper';
import { UserValueType } from './userValueType';
import { IUserValueType } from './userValueType.interface';
import { alphabeticSortLabel } from '@common/helpers/common.helper';
import { BFLITE_TYPES_MAP, DEFAULT_GROUP_VALUES, BFLITE_URIS } from '@common/constants/bibframeMapping.constants';

export class SimpleLookupUserValueService extends UserValueType implements IUserValueType {
  private uri?: string;
  private groupUri?: string;
  private propertyUri?: string;
  private loadedData?: MultiselectOption[];
  private contents?: UserValueContents[];

  constructor(
    private readonly apiClient: IApiClient,
    private readonly cacheService: ILookupCacheService,
  ) {
    super();
  }

  async generate({ data, uri, uuid, uriSelector, type, propertyUri, groupUri, fieldUri }: UserValueDTO) {
    this.uri = uri;
    this.groupUri = groupUri;
    this.propertyUri = propertyUri;
    const cachedData = this.getCachedData();

    if (!cachedData) {
      await this.loadData();
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
    const loadedOption = this.cacheService
      .getById(uri as string)
      ?.find(
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

  private getCachedData() {
    return this.uri ? this.cacheService.getById(this.uri) : undefined;
  }

  private saveLoadedData() {
    if (!this.uri || !this.loadedData) return;

    this.cacheService.save(this.uri, this.loadedData);
  }

  private async loadData() {
    const response = await this.apiClient.loadSimpleLookupData(this.uri as string);

    if (!response) return;

    const formattedLookupData = formatLookupOptions(response, this.uri);
    const filteredLookupData = filterLookupOptionsByMappedValue(formattedLookupData, this.propertyUri, this.groupUri);

    this.loadedData = filteredLookupData?.toSorted(alphabeticSortLabel);

    this.saveLoadedData();
  }
}
