export interface IUserValueType {
  getValue: () => UserValue;

  generate: ({ data, uri, uuid, labelSelector, uriSelector, type }: UserValueDTO) => void | Promise<void>;
}
