import { recordGeneratorService } from '@src/test/__mocks__/common/hooks/useServicesContext.mock';
import * as Router from 'react-router-dom';
import { renderHook } from '@testing-library/react';
import { useRecordGeneration } from '@common/hooks/useRecordGeneration';
import { setInitialGlobalState } from '@src/test/__mocks__/store';
import { useInputsStore, useProfileStore } from '@src/store';

describe('useRecordGeneration', () => {
  it('generates a record using new service', () => {
    const schema = 'mockSchema';
    const userValues = 'mockUserValues';
    const selectedEntries: string[] = [];

    const searchParams = new URLSearchParams('?block=testBlock&reference.key=testKey');
    jest.spyOn(Router, 'useSearchParams').mockReturnValueOnce([searchParams, jest.fn()]);

    setInitialGlobalState([
      {
        store: useProfileStore,
        state: {
          schema,
        },
      },
      {
        store: useInputsStore,
        state: {
          userValues,
          selectedEntries,
          record: {
            resource: {
              testBlock: {
                testKey: [{ id: 'testId' }],
              },
            },
          },
        },
      },
    ]);

    const { result } = renderHook(() => useRecordGeneration());

    result.current.generateRecord({});

    expect(recordGeneratorService.generate).toHaveBeenCalledWith(
      { schema, userValues, selectedEntries, referenceIds: undefined },
      'work',
    );
  });
});
