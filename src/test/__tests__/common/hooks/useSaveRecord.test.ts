import { renderHook } from '@testing-library/react';
import { useSearchParams } from 'react-router-dom';
import { useSaveRecord } from '@common/hooks/useSaveRecord';
import { useStatusStore } from '@src/store';
import { setInitialGlobalState } from '@src/test/__mocks__/store';

const mockSaveRecord = jest.fn();
const mockOpenModal = jest.fn();
const mockCloseModal = jest.fn();

jest.mock('react-router-dom', () => ({
  useSearchParams: jest.fn(),
}));

jest.mock('@common/hooks/useRecordStatus', () => ({
  useRecordStatus: () => ({
    hasBeenSaved: false,
  }),
}));

jest.mock('@common/hooks/useRecordControls', () => ({
  useRecordControls: () => ({
    saveRecord: mockSaveRecord,
  }),
}));

jest.mock('@common/hooks/useModalControls', () => ({
  useModalControls: () => ({
    isModalOpen: false,
    openModal: mockOpenModal,
    closeModal: mockCloseModal,
  }),
}));

describe('useSaveRecord', () => {
  const renderUseSaveRecordHook = (isRecordEdited = false, searchParamsCloneOf?: string) => {
    (useSearchParams as jest.Mock).mockReturnValue([{ get: () => searchParamsCloneOf }]);

    setInitialGlobalState([
      {
        store: useStatusStore,
        state: { isRecordEdited },
      },
    ]);

    return renderHook(() => useSaveRecord(true));
  };

  test('isButtonDisabled is false when record is edited', () => {
    const { result } = renderUseSaveRecordHook(true);

    expect(result.current.isButtonDisabled).toBeFalsy();
  });

  test('isButtonDisabled is false when cloning record', () => {
    const { result } = renderUseSaveRecordHook(false, 'cloneOfId');

    expect(result.current.isButtonDisabled).toBeFalsy();
  });

  test('saveRecord calls useRecordControls.saveRecord with correct params', () => {
    const { result } = renderUseSaveRecordHook(true);

    result.current.saveRecord();

    expect(mockSaveRecord).toHaveBeenCalledWith({ isNavigatingBack: true });
  });

  test('modal controls are exposed correctly', () => {
    const { result } = renderUseSaveRecordHook();

    result.current.openModal();
    expect(mockOpenModal).toHaveBeenCalled();

    result.current.closeModal();
    expect(mockCloseModal).toHaveBeenCalled();
  });
});
