import { recordGeneratorService } from '@/test/__mocks__/common/hooks/useSchemaPipeline.mock';
import { setInitialGlobalState } from '@/test/__mocks__/store';

import { renderHook } from '@testing-library/react';

import { useInputsStore, useProfileStore } from '@/store';

import { useRecordGeneration } from './useRecordGeneration';

let mockSearchParams = new URLSearchParams('?type=work');

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useSearchParams: () => [mockSearchParams, jest.fn()],
}));

describe('useRecordGeneration', () => {
  beforeEach(() => {
    mockSearchParams = new URLSearchParams('?type=work');
  });

  it('generates a record using new service', () => {
    const schema = 'mockSchema';
    const userValues = 'mockUserValues';
    const selectedEntries: string[] = [];
    const profileId = '2';

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
