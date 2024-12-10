import { openModal } from '@src/test/__mocks__/common/hooks/useModalControls.mock';
import { checkButtonDisabledState } from '@src/test/__mocks__/common/helpers/recordControls.helper.mock';
import '@src/test/__mocks__/common/hooks/useRoutePathPattern.mock';
import '@src/test/__mocks__/common/hooks/useRecordControls.mock';
import '@src/test/__mocks__/components/Modal.mock';
import { fireEvent, render, screen } from '@testing-library/react';
import { DeleteRecord } from '@components/DeleteRecord';
import { setInitialGlobalState } from '@src/test/__mocks__/store';
import { useInputsStore } from '@src/store';

describe('DeleteRecord', () => {
  const mockedRecord = {
    id: 'testId',
    profile: 'testProfile',
  } as unknown as RecordEntry;

  const renderComponent = (recordState: RecordEntry | null) => {
    setInitialGlobalState([
      {
        store: useInputsStore,
        state: { record: recordState },
      },
    ]);

    return render(<DeleteRecord />);
  };

  const getButtonElement = () => screen.getByTestId('delete-record-button');

  test('renders Modal component and "Delete record" button which is not disabled', () => {
    checkButtonDisabledState.mockReturnValue(undefined);

    renderComponent(mockedRecord);

    const button = getButtonElement();

    expect(screen.getByTestId('modal-component')).toBeInTheDocument();
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  test('renders disabled "Delete record" button for Edit resource page', () => {
    checkButtonDisabledState.mockReturnValue('/test_url');

    renderComponent(mockedRecord);

    expect(getButtonElement()).toBeDisabled();
  });

  test('renders disabled "Delete record" button for Create resource page', () => {
    checkButtonDisabledState.mockReturnValue(undefined);

    renderComponent(null);

    expect(getButtonElement()).toBeDisabled();
  });

  test('triggers "openModal" function', () => {
    checkButtonDisabledState.mockReturnValue(undefined);

    renderComponent(mockedRecord);
    fireEvent.click(getButtonElement());

    expect(openModal).toHaveBeenCalledTimes(1);
  });
});
