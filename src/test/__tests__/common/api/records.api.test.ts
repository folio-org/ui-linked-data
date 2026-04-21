import baseApi from '@/common/api/base.api';
import { getGraphIdByExternalId, getRecord } from '@/common/api/records.api';
import { ExternalResourceIdType } from '@/common/constants/api.constants';

describe('records.api', () => {
  describe('getRecord', () => {
    const mockRecordId = 'record_1';

    it('fetches record with recordId', async () => {
      const testResult = { id: mockRecordId };

      const mockBaseApiGetJson = jest.fn(() => Promise.resolve(testResult)) as jest.Mock;

      jest.spyOn(baseApi, 'getJson').mockImplementation(mockBaseApiGetJson);

      const result = await getRecord({ recordId: mockRecordId });

      expect(result).toEqual(testResult);
      expect(mockBaseApiGetJson).toHaveBeenCalledWith({
        url: expect.stringContaining(mockRecordId),
        requestParams: { method: 'GET' },
      });
    });

    it('passes signal to request when provided', async () => {
      const testResult = { id: mockRecordId };
      const abortController = new AbortController();
      const signal = abortController.signal;

      const mockBaseApiGetJson = jest.fn(() => Promise.resolve(testResult)) as jest.Mock;

      jest.spyOn(baseApi, 'getJson').mockImplementation(mockBaseApiGetJson);

      await getRecord({ recordId: mockRecordId, signal });

      expect(mockBaseApiGetJson).toHaveBeenCalledWith({
        url: expect.stringContaining(mockRecordId),
        requestParams: { method: 'GET', signal },
      });
    });

    it('uses alternative URL when idType is provided', async () => {
      const testResult = { id: mockRecordId };
      const idType = ExternalResourceIdType.Inventory;

      const mockBaseApiGetJson = jest.fn(() => Promise.resolve(testResult)) as jest.Mock;

      jest.spyOn(baseApi, 'getJson').mockImplementation(mockBaseApiGetJson);

      await getRecord({ recordId: mockRecordId, idType });

      expect(mockBaseApiGetJson).toHaveBeenCalledWith({
        url: expect.any(String),
        requestParams: { method: 'GET' },
      });
    });

    it('uses alternative URL and passes signal when both idType and signal are provided', async () => {
      const testResult = { id: mockRecordId };
      const abortController = new AbortController();
      const signal = abortController.signal;
      const idType = ExternalResourceIdType.Inventory;

      const mockBaseApiGetJson = jest.fn(() => Promise.resolve(testResult)) as jest.Mock;

      jest.spyOn(baseApi, 'getJson').mockImplementation(mockBaseApiGetJson);

      await getRecord({ recordId: mockRecordId, idType, signal });

      expect(mockBaseApiGetJson).toHaveBeenCalledWith({
        url: expect.any(String),
        requestParams: { method: 'GET', signal },
      });
    });

    it('allows aborting request with signal', async () => {
      const abortController = new AbortController();
      const signal = abortController.signal;

      const mockBaseApiGetJson = jest.fn(
        () =>
          new Promise((_, reject) => {
            signal.addEventListener('abort', () => {
              reject(new DOMException('Aborted', 'AbortError'));
            });
          }),
      ) as jest.Mock;

      jest.spyOn(baseApi, 'getJson').mockImplementation(mockBaseApiGetJson);

      const requestPromise = getRecord({ recordId: mockRecordId, signal });

      abortController.abort();

      await expect(requestPromise).rejects.toThrow('Aborted');
      expect(mockBaseApiGetJson).toHaveBeenCalledWith({
        url: expect.stringContaining(mockRecordId),
        requestParams: { method: 'GET', signal },
      });
    });
  });

  describe('getGraphIdByExternalId', () => {
    test('returns graph id', async () => {
      const testResult = { id: 'mockId' };

      const mockBaseApiRequest = jest.fn(() =>
        Promise.resolve({ ok: true, json: () => Promise.resolve(testResult) }),
      ) as jest.Mock;

      jest.spyOn(baseApi, 'request').mockImplementation(mockBaseApiRequest);

      expect(await getGraphIdByExternalId({ recordId: 'anyId' })).toEqual(testResult);
      expect(mockBaseApiRequest).toHaveBeenCalled();
    });
  });
});
