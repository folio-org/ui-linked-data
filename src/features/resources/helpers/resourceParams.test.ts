import { BibframeEntitiesMap } from '@/common/constants/bibframe.constants';
import { mapToResourceType } from '@/configs/resourceTypes';

import { extractProfileParams } from './resourceParams';

jest.mock('@/configs/resourceTypes', () => ({
  mapToResourceType: jest.fn((value: string) => value ?? 'work'),
}));

describe('extractProfileParams', () => {
  beforeEach(() => {
    (mapToResourceType as jest.Mock).mockImplementation((value: string) => value ?? 'work');
  });

  describe('when recordData is empty', () => {
    it('falls back to typeParam', () => {
      const result = extractProfileParams({
        recordData: {},
        profileIdParam: 'profile-from-url',
        typeParam: 'work',
        editingRecordBlocks: undefined,
      });

      expect(result.profileId).toBe('profile-from-url');
      expect(mapToResourceType).toHaveBeenCalledWith('work');
    });

    it('returns undefined referenceProfileId', () => {
      const result = extractProfileParams({
        recordData: {},
        profileIdParam: null,
        typeParam: null,
      });

      expect(result).not.toHaveProperty('referenceProfileId');
    });
  });

  describe('when recordData is non-empty', () => {
    const block = 'http://bibfra.me/vocab/lite/Instance' as keyof typeof BibframeEntitiesMap;
    const blockData = { profileId: 'record-profile-id' };

    it('uses the profileId from the record', () => {
      const result = extractProfileParams({
        recordData: { [block]: blockData } as unknown as RecordData,
        profileIdParam: 'url-profile-id',
        typeParam: 'instance',
        editingRecordBlocks: { block },
      });

      expect(result.profileId).toBe('record-profile-id');
    });

    it('falls back to profileIdParam when record has no profileId', () => {
      const result = extractProfileParams({
        recordData: { [block]: {} } as unknown as RecordData,
        profileIdParam: 'url-profile-id',
        typeParam: 'instance',
        editingRecordBlocks: { block },
      });

      expect(result.profileId).toBe('url-profile-id');
    });

    it('derives resourceType from BibframeEntitiesMap', () => {
      extractProfileParams({
        recordData: { [block]: blockData } as unknown as RecordData,
        profileIdParam: null,
        typeParam: null,
        editingRecordBlocks: { block },
      });

      expect(mapToResourceType).toHaveBeenCalledWith(BibframeEntitiesMap[block]);
    });

    it('extracts referenceProfileId from nested reference array', () => {
      const referenceKey = 'workReference';
      const referenceProfileId = 'ref-profile-id';

      const result = extractProfileParams({
        recordData: {
          [block]: {
            profileId: 'record-profile-id',
            [referenceKey]: [{ profileId: referenceProfileId }],
          },
        } as unknown as RecordData,
        profileIdParam: null,
        typeParam: null,
        editingRecordBlocks: {
          block,
          reference: { key: referenceKey, uri: 'some-uri' },
        },
      });

      expect(result.referenceProfileId).toBe(referenceProfileId);
    });

    it('returns undefined referenceProfileId when no reference key provided', () => {
      const result = extractProfileParams({
        recordData: { [block]: blockData } as unknown as RecordData,
        profileIdParam: null,
        typeParam: null,
        editingRecordBlocks: { block },
      });

      expect(result.referenceProfileId).toBeUndefined();
    });
  });
});
