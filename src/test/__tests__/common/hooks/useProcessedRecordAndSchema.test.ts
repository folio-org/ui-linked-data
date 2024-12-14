import '@src/test/__mocks__/common/hooks/useServicesContext.mock';
import { useProcessedRecordAndSchema } from '@common/hooks/useProcessedRecordAndSchema.hook';
import { act, renderHook } from '@testing-library/react';
import { setInitialGlobalState } from '@src/test/__mocks__/store';
import { useInputsStore, useStatusStore } from '@src/store';

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

  test("doesn't update state when asked not to", () => {
    const { result } = renderHook(useProcessedRecordAndSchema);

    act(() => {
      result.current.getProcessedRecordAndSchema({ ...props, noStateUpdate: true });
    });

    expect(mockSetRecord).not.toHaveBeenCalled();
  });

  test('updates state when not asked to not update state', () => {
    const { result } = renderHook(useProcessedRecordAndSchema);

    act(() => {
      result.current.getProcessedRecordAndSchema(props);
    });

    expect(mockSetRecord).toHaveBeenCalled();
  });
});
