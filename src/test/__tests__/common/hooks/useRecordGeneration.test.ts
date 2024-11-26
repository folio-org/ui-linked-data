import { recordGeneratorService } from '@src/test/__mocks__/common/hooks/useServicesContext.mock';
import { useRecoilValue } from 'recoil';
import { renderHook } from '@testing-library/react';
import { useRecordGeneration } from '@common/hooks/useRecordGeneration';

jest.mock('recoil');

describe('useRecordGeneration', () => {
  it('generates a record successfully', () => {
    const schema = 'mockSchema';
    const userValues = 'mockUserValues';
    const selectedEntries = 'mockSelectedEntries';
    const initKey = 'mockInitialSchemaKey';

    (useRecoilValue as jest.Mock)
      .mockReturnValueOnce(schema)
      .mockReturnValueOnce(userValues)
      .mockReturnValueOnce(selectedEntries)
      .mockReturnValueOnce(initKey);

    const { result } = renderHook(() => useRecordGeneration());

    result.current.generateRecord();

    expect(recordGeneratorService.init).toHaveBeenCalledWith({
      schema,
      initKey,
      userValues,
      selectedEntries,
    });
    expect(recordGeneratorService.generate).toHaveBeenCalled();
  });
});
