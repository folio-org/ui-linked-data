import StorageService from '@/common/services/storage/baseStorage.service';

class DummyStorageService extends StorageService {}

describe('StorageService', () => {
  let storageInstance: StorageService;
  const key = 'testKey';

  beforeAll(() => {
    storageInstance = new DummyStorageService(localStorage);
  });

  describe('serialize', () => {
    let spySetItem: jest.SpyInstance<void, [key: string, value: string], any>;

    beforeEach(() => {
      spySetItem = jest.spyOn(Storage.prototype, 'setItem').mockImplementation((_, value) => value);
    });

    test('calls "setItem" with a passed string', () => {
      const value = 'test_value';

      storageInstance.serialize(key, value);

      expect(spySetItem).toHaveBeenCalledWith(key, value);
    });

    test('calls "setItem" with serialized data', () => {
      const spyJsonSerialize = jest.spyOn(JSON, 'stringify');
      const value = { key: 'value' };
      const testValue = '{"key":"value"}';

      storageInstance.serialize(key, value);

      expect(spyJsonSerialize).toHaveBeenCalledWith(value);
      expect(spySetItem).toHaveBeenCalledWith(key, testValue);
    });
  });

  describe('deserialize', () => {
    const getTestResult = (data: string | null, parsedData?: Record<string, any>) => {
      jest.spyOn(Storage.prototype, 'getItem').mockImplementation(_ => data);

      if (parsedData) {
        jest.spyOn(JSON, 'parse').mockImplementation(_ => parsedData);
      }

      return storageInstance.deserialize(key);
    };

    test('returns null if there is no data in storage', () => {
      const result = getTestResult(null);

      expect(result).toBeNull();
    });

    test('returns parsed JSON', () => {
      const data = '{"key":"value"}';
      const parsedData = { key: 'value' };
      const result = getTestResult(data, parsedData);

      expect(result).toBe(parsedData);
    });

    test('returns saved data in non-json format', () => {
      jest.spyOn(console, 'error').mockReturnValue();
      const data = 'test_data';
      const result = getTestResult(data);

      expect(result).toBe(data);
    });
  });

  describe('delete', () => {
    test('calls "removeItem" with a proper key', () => {
      const spyRemoveItem = jest.spyOn(Storage.prototype, 'removeItem').mockImplementation(key => key);

      storageInstance.delete(key);

      expect(spyRemoveItem).toHaveBeenCalledWith(key);
    });
  });
});
