import {
  recordGeneratorService,
  recordGeneratorServiceLegacy,
} from '@src/test/__mocks__/common/hooks/useServicesContext.mock';
import * as Router from 'react-router-dom';
import { renderHook } from '@testing-library/react';
import { useRecordGeneration } from '@common/hooks/useRecordGeneration';
import { setInitialGlobalState } from '@src/test/__mocks__/store';
import { useInputsStore, useProfileStore } from '@src/store';
import { getMockedImportedConstant } from '@src/test/__mocks__/common/constants/constants.mock';
import * as FeatureConstants from '@common/constants/feature.constants';

describe('useRecordGeneration', () => {
  const mockCUSTOM_PROFILE_ENABLED = getMockedImportedConstant(FeatureConstants, 'CUSTOM_PROFILE_ENABLED');

  describe('when CUSTOM_PROFILE_ENABLED is false', () => {
    it('generates a record using legacy service', () => {
      const schema = 'mockSchema';
      const userValues = 'mockUserValues';
      const selectedEntries = 'mockSelectedEntries';
      const initKey = 'mockInitialSchemaKey';

      mockCUSTOM_PROFILE_ENABLED(false);
      jest.spyOn(Router, 'useSearchParams').mockReturnValueOnce([new URLSearchParams(), jest.fn()]);

      setInitialGlobalState([
        {
          store: useProfileStore,
          state: {
            schema,
            initialSchemaKey: initKey,
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

      result.current.generateRecord();

      expect(recordGeneratorServiceLegacy.init).toHaveBeenCalledWith({
        schema,
        initKey,
        userValues,
        selectedEntries,
      });
      expect(recordGeneratorServiceLegacy.generate).toHaveBeenCalled();
    });
  });

  describe('when CUSTOM_PROFILE_ENABLED is true', () => {
    it('generates a record using new service', () => {
      const schema = 'mockSchema';
      const userValues = 'mockUserValues';
      const selectedProfile = { id: 'monograph' };

      mockCUSTOM_PROFILE_ENABLED(true);
      const searchParams = new URLSearchParams('?block=testBlock&reference.key=testKey');
      jest.spyOn(Router, 'useSearchParams').mockReturnValueOnce([searchParams, jest.fn()]);

      setInitialGlobalState([
        {
          store: useProfileStore,
          state: {
            schema,
            selectedProfile,
          },
        },
        {
          store: useInputsStore,
          state: {
            userValues,
            record: {
              resource: {
                testBlock: {
                  testKey: [{ id: 'testId' }],
                },
              },
            },
          },
        },
      ]);

      const { result } = renderHook(() => useRecordGeneration());

      result.current.generateRecord();

      expect(recordGeneratorService.generate).toHaveBeenCalledWith(
        { schema, userValues, referenceIds: undefined },
        'monograph',
        'work',
      );
    });
  });
});
