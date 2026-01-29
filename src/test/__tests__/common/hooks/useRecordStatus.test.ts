import { setInitialGlobalState } from '@/test/__mocks__/store';

import { useParams } from 'react-router-dom';

import { renderHook } from '@testing-library/react';

import { useRecordStatus } from '@/common/hooks/useRecordStatus';

import { useStatusStore } from '@/store';

const mockResourceId = 'mockResourceId';

jest.mock('react-router-dom');

describe('useRecordStatus', () => {
  const renderUseRecordStatusHook = (lastSavedIdEqual = false) => {
    (useParams as jest.Mock).mockReturnValueOnce({ resourceId: mockResourceId });
    setInitialGlobalState([
      {
        store: useStatusStore,
        state: { lastSavedRecordId: lastSavedIdEqual ? mockResourceId : 'anotherId' },
      },
    ]);

    const {
      result: { current },
    } = renderHook(() => useRecordStatus());

    return current;
  };

  it('hasBeenSaved is false when lastSavedId is different from resourceId', () => {
    const { hasBeenSaved } = renderUseRecordStatusHook();

    expect(hasBeenSaved).toBeFalsy();
  });

  it('hasBeenSaved is true when lastSavedId is equal to resourceId', () => {
    const { hasBeenSaved } = renderUseRecordStatusHook(true);

    expect(hasBeenSaved).toBeTruthy();
  });
});
