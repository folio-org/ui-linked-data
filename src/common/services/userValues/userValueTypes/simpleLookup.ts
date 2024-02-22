import { filterLookupOptionsByMappedValue, formatLookupOptions } from '@common/helpers/lookupOptions.helper';
import { UserValueType } from './userValueType';
import { IUserValueType } from './userValueType.interface';
import { alphabeticSortLabel } from '@common/helpers/common.helper';
import { BFLITE_TYPES_MAP } from '@common/constants/bibframeMapping.constants';

export class SimpleLookupUserValueService extends UserValueType implements IUserValueType {
  private uri?: string;
  private propertyUri?: string;
  private cachedData: Record<string, MultiselectOption[]>;
  private loadedData?: MultiselectOption[];
  private contents?: UserValueContents[];

  constructor(
    private apiClient: any,
    private cacheService: ILookupCacheService,
  ) {
    super();

    this.cachedData = { ...this.cacheService.getAll() };
  }

  async generate({ data, uri, uuid, labelSelector, uriSelector, type, propertyUri, groupUri }: UserValueDTO) {
    this.uri = uri;
    this.propertyUri = propertyUri;
    const cachedData = this.getCachedData();

    if (!cachedData) {
      await this.loadData();
    }

    this.contents = [];

    if (Array.isArray(data)) {
      for (const dataEntry of data as Record<string, string[]>[]) {
        this.generateContentItem({
          label: dataEntry[labelSelector as string]?.[0],
          itemUri: dataEntry[uriSelector as string]?.[0],
          uri,
          groupUri,
          type,
        });
      }
    } else {
      const typedData = data as Record<string, string[]>;

      this.generateContentItem({
        label: typedData[labelSelector as string]?.[0],
        itemUri: typedData[uriSelector as string]?.[0],
        uri,
        groupUri,
        type,
      });
    }

    this.value = {
      uuid,
      contents: this.contents,
    };
  }

  private generateContentItem({
    label,
    itemUri,
    uri,
    groupUri,
    type,
  }: {
    label: string;
    itemUri?: string;
    uri?: string;
    groupUri?: string;
    type?: AdvancedFieldType;
  }) {
    const typesMap = (BFLITE_TYPES_MAP as FieldTypeMap)[groupUri as string];
    const mappedUri = typesMap && itemUri ? typesMap?.data?.[itemUri]?.uri : uri;
    // Check if the loaded options contain a value from the record
    const loadedOption = this.loadedData?.find(({ value }) => value.uri === mappedUri || value.label === label);
    const selectedLabel = typesMap && itemUri ? loadedOption?.label || itemUri : loadedOption?.label || label;

    const contentItem = {
      label: selectedLabel,
      meta: {
        parentUri: itemUri,
        uri,
        type,
      },
    };

    this.contents?.push(contentItem);
  }

  private getCachedData() {
    return this.uri ? this.cacheService.getById(this.uri) || this.cachedData?.[this.uri] : undefined;
  }

  private saveLoadedData() {
    if (!this.uri || !this.loadedData) return;

    this.cachedData[this.uri] = this.loadedData;
    this.cacheService.save(this.uri, this.loadedData);
  }

  private async loadData() {
    const response = await this.apiClient.load(this.uri);

    if (!response) return;

    const formattedLookupData = formatLookupOptions(response, this.uri);
    const filteredLookupData = filterLookupOptionsByMappedValue(formattedLookupData, this.propertyUri);

    this.loadedData = filteredLookupData?.sort(alphabeticSortLabel);

    this.saveLoadedData();
  }
}
