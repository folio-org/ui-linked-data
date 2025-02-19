import { renderHook } from '@testing-library/react';
import { useSaveRecordWarning } from '@common/hooks/useSaveRecordWarning';
import { useUIStore, useInputsStore } from '@src/store';
import { TYPE_URIS } from '@common/constants/bibframe.constants';
import { setInitialGlobalState } from '@src/test/__mocks__/store';

describe('useSaveRecordWarning', () => {
  const mockSetHasShownAuthorityWarning = jest.fn();

  const setupMocks = ({
    hasShownAuthorityWarning = false,
    userValues = {},
    selectedRecordBlocks = { block: '' },
  } = {}) => {
    setInitialGlobalState([
      {
        store: useUIStore,
        state: {
          hasShownAuthorityWarning,
          setHasShownAuthorityWarning: mockSetHasShownAuthorityWarning,
        },
      },
      {
        store: useInputsStore,
        state: {
          userValues,
          selectedRecordBlocks,
        },
      },
    ]);
  };

  it('returns shouldDisplayWarningMessage as false when not on work edit page', () => {
    setupMocks({
      selectedRecordBlocks: { block: 'not-work' },
    });

    const { result } = renderHook(() => useSaveRecordWarning());

    expect(result.current.shouldDisplayWarningMessage).toBeFalsy();
  });

  it('returns shouldDisplayWarningMessage as false when no uncontrolled authorities', () => {
    setupMocks({
      selectedRecordBlocks: { block: TYPE_URIS.WORK },
      userValues: {
        field1: {
          contents: [{ meta: { isPreferred: true } }],
        },
      },
    });

    const { result } = renderHook(() => useSaveRecordWarning());

    expect(result.current.shouldDisplayWarningMessage).toBeFalsy();
  });

  it('returns shouldDisplayWarningMessage as true when conditions are met', () => {
    setupMocks({
      hasShownAuthorityWarning: false,
      selectedRecordBlocks: { block: TYPE_URIS.WORK },
      userValues: {
        field1: {
          contents: [{ meta: { isPreferred: false } }],
        },
      },
    });

    const { result } = renderHook(() => useSaveRecordWarning());

    expect(result.current.shouldDisplayWarningMessage).toBeTruthy();
  });

  it('returns shouldDisplayWarningMessage as false when warning was already shown', () => {
    setupMocks({
      hasShownAuthorityWarning: true,
      selectedRecordBlocks: { block: TYPE_URIS.WORK },
      userValues: {
        field1: {
          contents: [{ meta: { isPreferred: false } }],
        },
      },
    });

    const { result } = renderHook(() => useSaveRecordWarning());

    expect(result.current.shouldDisplayWarningMessage).toBeFalsy();
  });

  it('exposes setHasShownAuthorityWarning function', () => {
    setupMocks();

    const { result } = renderHook(() => useSaveRecordWarning());

    expect(result.current.setHasShownAuthorityWarning).toBe(mockSetHasShownAuthorityWarning);
  });
});
