import { setInitialGlobalState } from '@/test/__mocks__/store';

import { renderHook, waitFor } from '@testing-library/react';

import { StatusType } from '@/common/constants/status.constants';
import { AdvancedFieldType } from '@/common/constants/uiControls.constants';
import { UserNotificationFactory } from '@/common/services/userNotification';

import { useStatusStore } from '@/store';

import { useHubAssignment } from './useHubAssignment';
import * as useHubImportAssignmentMutation from './useHubImportAssignmentMutation';

jest.mock('./useHubImportAssignmentMutation');
jest.mock('@/common/services/userNotification', () => ({
  UserNotificationFactory: {
    createMessage: jest.fn(),
  },
}));

describe('useHubAssignment', () => {
  const mockOnAssignSuccess = jest.fn();
  const mockAddStatusMessagesItem = jest.fn();
  const mockImportForAssignment = jest.fn();

  beforeEach(() => {
    setInitialGlobalState([
      {
        store: useStatusStore,
        state: {
          addStatusMessagesItem: mockAddStatusMessagesItem,
        },
      },
    ]);

    (useHubImportAssignmentMutation.useHubImportAssignmentMutation as jest.Mock).mockReturnValue({
      importForAssignment: mockImportForAssignment,
      isPending: false,
    });
  });

  describe('handleAssign - local hubs', () => {
    it('assigns local hub without importing', async () => {
      const { result } = renderHook(() => useHubAssignment({ onAssignSuccess: mockOnAssignSuccess }));

      const localHub: ComplexLookupAssignRecordDTO = {
        id: 'local_hub_1',
        title: 'Local Hub Title',
        uri: 'http://example.com/hub1',
        sourceType: 'local',
      };

      await result.current.handleAssign(localHub);

      expect(mockImportForAssignment).not.toHaveBeenCalled();
      expect(mockOnAssignSuccess).toHaveBeenCalledWith({
        id: 'local_hub_1',
        label: 'Local Hub Title',
        meta: {
          type: AdvancedFieldType.complex,
          uri: 'http://example.com/hub1',
          sourceType: 'local',
        },
      });
    });

    it('uses original id for local hub', async () => {
      const { result } = renderHook(() => useHubAssignment({ onAssignSuccess: mockOnAssignSuccess }));

      const localHub: ComplexLookupAssignRecordDTO = {
        id: 'local_id_123',
        title: 'Local Hub',
        uri: 'http://example.com/hub',
        sourceType: 'local',
      };

      await result.current.handleAssign(localHub);

      const assignedValue = mockOnAssignSuccess.mock.calls[0][0];
      expect(assignedValue.id).toBe('local_id_123');
    });
  });

  describe('handleAssign - external hubs', () => {
    it('imports external hub before assigning', async () => {
      mockImportForAssignment.mockResolvedValue({ importedId: 'imported_id_1' });

      const { result } = renderHook(() => useHubAssignment({ onAssignSuccess: mockOnAssignSuccess }));

      const externalHub: ComplexLookupAssignRecordDTO = {
        id: 'external_hub_1',
        title: 'External Hub Title',
        uri: 'http://example.com/hub2',
        sourceType: 'libraryOfCongress',
      };

      await result.current.handleAssign(externalHub);

      expect(mockImportForAssignment).toHaveBeenCalledWith({ hubUri: 'http://example.com/hub2' });
      expect(mockOnAssignSuccess).toHaveBeenCalledWith({
        id: 'imported_id_1',
        label: 'External Hub Title',
        meta: {
          type: AdvancedFieldType.complex,
          uri: 'http://example.com/hub2',
          sourceType: 'libraryOfCongress',
        },
      });
    });

    it('uses imported id for external hub', async () => {
      mockImportForAssignment.mockResolvedValue({ importedId: 'new_imported_id' });

      const { result } = renderHook(() => useHubAssignment({ onAssignSuccess: mockOnAssignSuccess }));

      const externalHub: ComplexLookupAssignRecordDTO = {
        id: 'original_external_id',
        title: 'External Hub',
        uri: 'http://example.com/hub',
        sourceType: 'libraryOfCongress',
      };

      await result.current.handleAssign(externalHub);

      const assignedValue = mockOnAssignSuccess.mock.calls[0][0];
      expect(assignedValue.id).toBe('new_imported_id');
      expect(assignedValue.id).not.toBe('original_external_id');
    });

    it('shows error notification when import fails', async () => {
      const importError = new Error('Import failed');
      mockImportForAssignment.mockRejectedValue(importError);
      const mockMessage = { type: StatusType.error, content: 'ld.errorImportingHub' };
      (UserNotificationFactory.createMessage as jest.Mock).mockReturnValue(mockMessage);

      const { result } = renderHook(() => useHubAssignment({ onAssignSuccess: mockOnAssignSuccess }));

      const externalHub: ComplexLookupAssignRecordDTO = {
        id: 'hub_id_1',
        title: 'Hub Title',
        uri: 'http://example.com/hub',
        sourceType: 'libraryOfCongress',
      };

      await result.current.handleAssign(externalHub);

      await waitFor(() => {
        expect(UserNotificationFactory.createMessage).toHaveBeenCalledWith(StatusType.error, 'ld.errorImportingHub');
        expect(mockAddStatusMessagesItem).toHaveBeenCalledWith(mockMessage);
      });
      expect(mockOnAssignSuccess).not.toHaveBeenCalled();
    });
  });

  describe('isAssigning state', () => {
    it('returns isPending from mutation hook', () => {
      (useHubImportAssignmentMutation.useHubImportAssignmentMutation as jest.Mock).mockReturnValue({
        importForAssignment: mockImportForAssignment,
        isPending: true,
      });

      const { result } = renderHook(() => useHubAssignment({ onAssignSuccess: mockOnAssignSuccess }));

      expect(result.current.isAssigning).toBe(true);
    });

    it('guards against concurrent calls when already assigning', async () => {
      (useHubImportAssignmentMutation.useHubImportAssignmentMutation as jest.Mock).mockReturnValue({
        importForAssignment: mockImportForAssignment,
        isPending: true,
      });

      const { result } = renderHook(() => useHubAssignment({ onAssignSuccess: mockOnAssignSuccess }));

      const hub: ComplexLookupAssignRecordDTO = {
        id: 'hub_1',
        title: 'Hub',
        uri: 'http://example.com/hub',
        sourceType: 'libraryOfCongress',
      };

      await result.current.handleAssign(hub);

      expect(mockImportForAssignment).not.toHaveBeenCalled();
      expect(mockOnAssignSuccess).not.toHaveBeenCalled();
    });
  });

  describe('edge cases', () => {
    it('handles hub without URI', async () => {
      const { result } = renderHook(() => useHubAssignment({ onAssignSuccess: mockOnAssignSuccess }));

      const hubWithoutUri: ComplexLookupAssignRecordDTO = {
        id: 'hub_2',
        title: 'Hub Without URI',
        sourceType: 'libraryOfCongress',
      };

      await result.current.handleAssign(hubWithoutUri);

      expect(mockImportForAssignment).not.toHaveBeenCalled();
      expect(mockOnAssignSuccess).toHaveBeenCalledWith({
        id: 'hub_2',
        label: 'Hub Without URI',
        meta: {
          type: AdvancedFieldType.complex,
          uri: undefined,
          sourceType: 'libraryOfCongress',
        },
      });
    });

    it('handles empty title', async () => {
      const { result } = renderHook(() => useHubAssignment({ onAssignSuccess: mockOnAssignSuccess }));

      const hubWithEmptyTitle: ComplexLookupAssignRecordDTO = {
        id: 'hub_3',
        title: '',
        uri: 'http://example.com/hub3',
        sourceType: 'local',
      };

      await result.current.handleAssign(hubWithEmptyTitle);

      expect(mockOnAssignSuccess).toHaveBeenCalledWith(
        expect.objectContaining({
          label: '',
        }),
      );
    });

    it('does not call onAssignSuccess when import fails', async () => {
      mockImportForAssignment.mockRejectedValue(new Error('Import error'));

      const { result } = renderHook(() => useHubAssignment({ onAssignSuccess: mockOnAssignSuccess }));

      const externalHub: ComplexLookupAssignRecordDTO = {
        id: 'hub_4',
        title: 'Hub',
        uri: 'http://example.com/hub4',
        sourceType: 'libraryOfCongress',
      };

      await result.current.handleAssign(externalHub);

      expect(mockOnAssignSuccess).not.toHaveBeenCalled();
    });
  });
});
