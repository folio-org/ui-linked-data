import '@src/test/__mocks__/common/hooks/useServicesContext.mock';
import { schemaWithDuplicatesService } from '@src/test/__mocks__/common/hooks/useServicesContext.mock';
import { useProfileSchema } from '@common/hooks/useProfileSchema';
import { renderHook } from '@testing-library/react';
import { useSetRecoilState, useRecoilState } from 'recoil';

jest.mock('recoil');

describe('useProfileSchema', () => {
  const entry = {
    uri: 'mockUri',
    path: ['testKey-0', 'testKey-2', 'testKey-4', 'testKey-6'],
    uuid: 'testKey-6',
    children: ['nonExistent', 'testKey-7'],
  };

  beforeEach(() => {
    (useSetRecoilState as jest.Mock).mockImplementation(jest.fn);
    (useRecoilState as jest.Mock).mockReturnValueOnce([new Set(), jest.fn()]);
  });

  test('get schema with copied entries', () => {
    const { result } = renderHook(() => useProfileSchema());

    result.current.getSchemaWithCopiedEntries(entry, []);

    expect(schemaWithDuplicatesService.duplicateEntry).toHaveBeenCalled();
  })

  test('get schema with deleted entries', () => {
    const { result } = renderHook(() => useProfileSchema());

    result.current.getSchemaWithDeletedEntries(entry);

    expect(schemaWithDuplicatesService.deleteEntry).toHaveBeenCalled();
  })
})