import { recordToSchemaMappingService } from '@/test/__mocks__/common/hooks/useServicesContext.mock';
import { setInitialGlobalState } from '@/test/__mocks__/store';

import { act, renderHook } from '@testing-library/react';

import { useProcessedRecordAndSchema } from '@/common/hooks/useProcessedRecordAndSchema';

import { useInputsStore, useStatusStore } from '@/store';

describe('useProcessedRecordAndSchema', () => {
  const mockSetRecord = jest.fn();
  const props = {
    baseSchema: {} as Schema,
    userValues: {},
    record: { key: 'value' },
  };

  beforeEach(() => {
    setInitialGlobalState([
      {
        store: useStatusStore,
        state: { addStatusMessagesItem: jest.fn() },
      },
      {
        store: useInputsStore,
        state: { setRecord: mockSetRecord },
      },
    ]);
  });

  test("doesn't update state when asked not to", async () => {
    const { result } = renderHook(useProcessedRecordAndSchema);

    await act(async () => {
      await result.current.getProcessedRecordAndSchema({ ...props, noStateUpdate: true });
    });

    expect(mockSetRecord).not.toHaveBeenCalled();
  });

  test('updates state when not asked to not update state', async () => {
    const { result } = renderHook(useProcessedRecordAndSchema);

    await act(async () => {
      await result.current.getProcessedRecordAndSchema(props);
    });

    expect(mockSetRecord).toHaveBeenCalled();
  });

  test('updates record state after schema mapping completes', async () => {
    let resolveInit: (() => void) | undefined;
    const initPromise = new Promise<void>(resolve => {
      resolveInit = resolve;
    });

    jest.spyOn(recordToSchemaMappingService, 'init').mockImplementation(() => initPromise);

    const { result } = renderHook(useProcessedRecordAndSchema);
    let processingPromise: Promise<unknown> | undefined;

    await act(async () => {
      processingPromise = result.current.getProcessedRecordAndSchema(props);
      await Promise.resolve();
    });

    expect(mockSetRecord).not.toHaveBeenCalled();

    await act(async () => {
      resolveInit?.();
      await processingPromise;
    });

    expect(mockSetRecord).toHaveBeenCalled();
  });
});
