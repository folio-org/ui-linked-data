import { recordGeneratorService } from '@src/test/__mocks__/common/hooks/useServicesContext.mock';
import { useRecoilValue } from 'recoil';
import { renderHook } from '@testing-library/react';
import { useRecordGeneration } from '@common/hooks/useRecordGeneration';
import { setInitialGlobalState } from '@src/test/__mocks__/store';
import { useInputsStore, useProfileStore } from '@src/store';

jest.mock('recoil');

describe('useRecordGeneration', () => {
  it('generates a record successfully', () => {
    const schema = 'mockSchema';
    const userValues = 'mockUserValues';
    const selectedEntries = 'mockSelectedEntries';
    const initKey = 'mockInitialSchemaKey';

    setInitialGlobalState([
      {
        store: useProfileStore,
        state: {
          schema,
          initialSchemaKey: initKey,
        },
      },
      {
        store: useInputsStore,
        state: {
          userValues,
        },
      },
    ]);

    (useRecoilValue as jest.Mock).mockReturnValueOnce(selectedEntries);

    const { result } = renderHook(() => useRecordGeneration());

    result.current.generateRecord();

    expect(recordGeneratorService.init).toHaveBeenCalledWith({
      schema,
      initKey,
      userValues,
      selectedEntries,
    });
    expect(recordGeneratorService.generate).toHaveBeenCalled();
  });
});
