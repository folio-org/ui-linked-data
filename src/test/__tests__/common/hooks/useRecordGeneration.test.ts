import { recordGeneratorService } from '@/test/__mocks__/common/hooks/useServicesContext.mock';
import { setInitialGlobalState } from '@/test/__mocks__/store';

import * as Router from 'react-router-dom';

import { renderHook } from '@testing-library/react';

import { useRecordGeneration } from '@/common/hooks/useRecordGeneration';

import { useInputsStore, useProfileStore } from '@/store';

describe('useRecordGeneration', () => {
  it('generates a record using new service', () => {
    const schema = 'mockSchema';
    const userValues = 'mockUserValues';
    const selectedEntries: string[] = [];
    const profileId = '2';

    const searchParams = new URLSearchParams('?type=work');
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
        },
      },
    ]);

    const { result } = renderHook(() => useRecordGeneration());

    result.current.generateRecord({});

    expect(recordGeneratorService.generate).toHaveBeenCalledWith(
      { profileId, schema, userValues, selectedEntries, referenceIds: undefined },
      'work',
    );
  });
});
