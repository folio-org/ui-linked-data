type StorageItemValue = string | typeof Array | Record<string, object | string | number>;

abstract class StorageService {
  constructor(private readonly storage: Storage) {}

  serialize(key: string, value: StorageItemValue) {
    const serializedValue = typeof value === 'string' ? value : JSON.stringify(value);

    this.storage.setItem(key, serializedValue);
  }

  deserialize(key: string) {
    const data = this.storage.getItem(key);

    if (!data) return null;

    try {
      return JSON.parse(data);
    } catch (error) {
      console.error('Cannot parse JSON:', error);

      return data;
    }
  }

  delete(key: string) {
    this.storage.removeItem(key);
  }
}

export default StorageService;
