type UserValueDTO = {
  data: string | string[] | Record<string, string[]> | Record<string, string[]>[];
  uri?: string;
  uuid?: string;
  labelSelector?: string;
  uriSelector?: string;
  type?: AdvancedFieldType;
  propertyUri?: string;
  blockUri?: string;
  groupUri?: string;
};
