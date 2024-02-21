import { filterLookupOptionsByMappedValue, formatLookupOptions } from '@common/helpers/lookupOptions.helper';
import { UserValueType } from './userValueType';
import { IUserValueType } from './userValueType.interface';
import { alphabeticSortLabel } from '@common/helpers/common.helper';

export class SimpleLookupUserValueService extends UserValueType implements IUserValueType {
  private uri?: string;
  private propertyURI?: string;
  private loadedData?: MultiselectOption[];
  private contents?: UserValueContents[];

  constructor(
    private apiClient: any,
    private cacheService: ILookupCacheService,
  ) {
    super();
  }

  async generate({ data, uri, uuid, labelSelector, uriSelector, type, propertyURI }: UserValueDTO) {
    this.uri = uri;
    this.propertyURI = propertyURI;
    const cachedData = this.getCachedData();

    if (!cachedData) {
      await this.loadData();
    }

    this.contents = [];

    if (Array.isArray(data)) {
      for (const dataEntry of data as Record<string, string[]>[]) {
        this.generateContentItem({
          label: dataEntry[labelSelector as string]?.[0],
          parentURI: dataEntry[uriSelector as string]?.[0],
          uri,
          type,
        });
      }
    } else {
      const typedData = data as Record<string, string[]>;

      this.generateContentItem({
        label: typedData[labelSelector as string]?.[0],
        parentURI: typedData[uriSelector as string]?.[0],
        uri,
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
    parentURI,
    uri,
    type,
  }: {
    label: string;
    parentURI?: string;
    uri?: string;
    type?: AdvancedFieldType;
  }) {
    const loadedOption = this.loadedData?.find(({ value }) => value.uri === parentURI);

    const contentItem = {
      label: loadedOption?.label || label,
      meta: {
        parentURI,
        uri,
        type,
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
    const response = await this.apiClient.load(this.uri);

    if (!response) return;

    const formattedLookupData = formatLookupOptions(response, this.uri);
    const filteredLookupData = filterLookupOptionsByMappedValue(formattedLookupData, this.propertyURI);
    this.loadedData = filteredLookupData?.sort(alphabeticSortLabel);

    this.saveLoadedData();
  }
}
