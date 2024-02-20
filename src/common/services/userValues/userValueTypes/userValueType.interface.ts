export interface IUserValueType {
  getValue: () => any;

  generate: ({ data, uri, uuid, labelSelector, uriSelector, type }: UserValueDTO) => void | Promise<void>;
}
