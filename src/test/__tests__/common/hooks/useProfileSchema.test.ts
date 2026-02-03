import { schemaWithDuplicatesService } from '@/test/__mocks__/common/hooks/useServicesContext.mock';

import { act, renderHook } from '@testing-library/react';

import { useProfileSchema } from '@/common/hooks/useProfileSchema';

describe('useProfileSchema', () => {
  const entry = {
    uri: 'mockUri',
    path: ['testKey-0', 'testKey-2', 'testKey-4', 'testKey-6'],
    uuid: 'testKey-6',
    children: ['nonExistent', 'testKey-7'],
  };

  test('get schema with copied entries', async () => {
    const { result } = renderHook(() => useProfileSchema());

    await act(async () => await result.current.updateSchemaWithCopiedEntries(entry, []));

    expect(schemaWithDuplicatesService.duplicateEntry).toHaveBeenCalled();
  });

  test('get schema with deleted entries', () => {
    const { result } = renderHook(() => useProfileSchema());

    act(() => result.current.updateSchemaWithDeletedEntries(entry));

    expect(schemaWithDuplicatesService.deleteEntry).toHaveBeenCalled();
  });
});
