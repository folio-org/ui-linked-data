export interface IUserValueType {
  generate: ({ data, uri, uuid, labelSelector, uriSelector, type }: UserValueDTO) => UserValue | Promise<UserValue>;
}
