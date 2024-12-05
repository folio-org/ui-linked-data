import '@src/test/__mocks__/common/hooks/useServicesContext.mock';
import { useProcessedRecordAndSchema } from '@common/hooks/useProcessedRecordAndSchema.hook';
import { act, renderHook } from '@testing-library/react';
import { useSetRecoilState } from 'recoil';

jest.mock('recoil');

describe('useProcessedRecordAndSchema', () => {
  const mockSetState = jest.fn();
  const props = {
    baseSchema: {} as Schema,
    userValues: {},
    record: { key: 'value' },
  };

  beforeEach(() => {
    (useSetRecoilState as jest.Mock).mockReturnValueOnce(mockSetState).mockReturnValueOnce(jest.fn());
  });

  test("doesn't update state when asked not to", () => {
    const { result } = renderHook(useProcessedRecordAndSchema);

    act(() => {
      result.current.getProcessedRecordAndSchema({ ...props, noStateUpdate: true });
    });

    expect(mockSetState).not.toHaveBeenCalled();
  });

  test('updates state when not asked to not update state', () => {
    const { result } = renderHook(useProcessedRecordAndSchema);

    act(() => {
      result.current.getProcessedRecordAndSchema(props);
    });

    expect(mockSetState).toHaveBeenCalled();
  });
});
