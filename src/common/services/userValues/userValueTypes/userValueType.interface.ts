export interface IUserValueType {
  generate: ({ data, uri, uuid, uriSelector, type }: UserValueDTO) => UserValue | Promise<UserValue>;
}
