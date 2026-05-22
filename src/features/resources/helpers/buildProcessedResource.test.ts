import * as profileHelper from '@/common/helpers/profile.helper';
import * as recordHelper from '@/common/helpers/record.helper';
import * as recordFormattingHelper from '@/common/helpers/recordFormatting.helper';

import { buildProcessedResource } from './buildProcessedResource';
import * as resourceParams from './resourceParams';

jest.mock('@/common/helpers/profile.helper');
jest.mock('@/common/helpers/record.helper');
jest.mock('@/common/helpers/recordFormatting.helper');
jest.mock('@/configs/resourceTypes', () => ({
  getUri: jest.fn(() => 'mock-uri'),
}));
jest.mock('./resourceParams');

const mockLoadProfile = jest.fn();
const mockLoadProfileSettings = jest.fn();

const makePipeline = (): SchemaPipelineServices => ({
  userValuesService: {
    set: jest.fn(),
    setValue: jest.fn(),
    getAllValues: jest.fn().mockReturnValue({ mockField: 'mockValue' }),
    getValue: jest.fn(),
  } as unknown as IUserValuesService,
  selectedEntriesService: {
    get: jest.fn().mockReturnValue([]),
    set: jest.fn(),
    addNew: jest.fn(),
    addDuplicated: jest.fn(),
    remove: jest.fn(),
  } as unknown as ISelectedEntriesService,
  schemaWithDuplicatesService: {
    get: jest.fn(),
    set: jest.fn(),
    duplicateEntry: jest.fn(),
    deleteEntry: jest.fn(),
  } as unknown as ISchemaWithDuplicatesService,
  recordNormalizingService: {
    init: jest.fn(),
    get: jest.fn().mockReturnValue({ normalizedKey: 'normalized' }),
  } as unknown as IRecordNormalizingService,
  recordToSchemaMappingService: {
    init: jest.fn().mockResolvedValue(undefined),
    get: jest.fn().mockReturnValue({ mappedKey: 'mappedSchema' }),
  } as unknown as IRecordToSchemaMappingService,
  recordGeneratorService: {
    generate: jest.fn(),
  } as unknown as IRecordGeneratorService,
  schemaGeneratorService: {
    init: jest.fn(),
    get: jest.fn().mockReturnValue({ generatedKey: 'generatedSchema' }),
    generate: jest.fn(),
  } as unknown as ISchemaGeneratorService,
});

const mockProfile = [{ id: 'profile-1' }] as unknown as Profile;
const mockProfileSettings = { id: 'settings-1' } as unknown as ProfileSettingsWithDrift;

describe('buildProcessedResource', () => {
  beforeEach(() => {
    (resourceParams.extractProfileParams as jest.Mock).mockReturnValue({
      profileId: 'profile-id',
      referenceProfileId: undefined,
      resourceType: 'work',
    });

    (profileHelper.getProfileConfig as jest.Mock).mockReturnValue({
      ids: ['profile-id'],
      rootEntry: null,
    });

    mockLoadProfile.mockResolvedValue(mockProfile);
    mockLoadProfileSettings.mockResolvedValue(mockProfileSettings);

    (recordHelper.getEditingRecordBlocks as jest.Mock).mockReturnValue({
      block: 'http://bibfra.me/vocab/lite/Instance',
      reference: undefined,
    });
    (recordHelper.getAdjustedRecordContents as jest.Mock).mockReturnValue({
      record: { adjustedKey: 'adjusted' } as unknown as RecordEntry,
    });
    (recordHelper.getPrimaryEntitiesFromRecord as jest.Mock).mockReturnValue(['lde:Profile:Work']);
    (recordHelper.getRecordTitle as jest.Mock).mockReturnValue('Test Title');
    (recordFormattingHelper.getReferenceIdsRaw as jest.Mock).mockReturnValue(['ref-id']);
  });

  it('returns null when no profile is loaded', async () => {
    mockLoadProfile.mockResolvedValue(undefined);

    (profileHelper.getProfileConfig as jest.Mock).mockReturnValue({
      ids: ['profile-id'],
      rootEntry: null,
    });

    const pipeline = makePipeline();
    const result = await buildProcessedResource({
      pipeline,
      loadProfile: mockLoadProfile,
      loadProfileSettings: mockLoadProfileSettings,
    });

    expect(result).toBeNull();
  });

  it('processes a new resource (no record)', async () => {
    const pipeline = makePipeline();

    const result = await buildProcessedResource({
      pipeline,
      loadProfile: mockLoadProfile,
      loadProfileSettings: mockLoadProfileSettings,
    });

    expect(pipeline.schemaGeneratorService.init).toHaveBeenCalledWith(mockProfile, mockProfileSettings);
    expect(pipeline.schemaGeneratorService.generate).toHaveBeenCalled();
    expect(pipeline.recordNormalizingService.init).not.toHaveBeenCalled();
    expect(pipeline.recordToSchemaMappingService.init).not.toHaveBeenCalled();

    expect(result).not.toBeNull();
    expect(result?.title).toBe('Test Title');
    expect(result?.entities).toBeUndefined();
    expect(result?.referenceIds).toBeUndefined();
  });

  it('processes an existing record with full pipeline', async () => {
    const record = {
      resource: { 'http://bibfra.me/vocab/lite/Instance': { profileId: 'profile-id' } },
    } as unknown as RecordEntry;

    const pipeline = makePipeline();

    const result = await buildProcessedResource({
      pipeline,
      record,
      loadProfile: mockLoadProfile,
      loadProfileSettings: mockLoadProfileSettings,
    });

    expect(pipeline.recordNormalizingService.init).toHaveBeenCalled();
    expect(pipeline.recordToSchemaMappingService.init).toHaveBeenCalled();
    expect(pipeline.userValuesService.getAllValues).toHaveBeenCalled();

    expect(result).not.toBeNull();
    expect(result?.entities).toEqual(['lde:Profile:Work']);
    expect(result?.referenceIds).toEqual(['ref-id']);
  });

  it('passes asClone flag to getAdjustedRecordContents', async () => {
    const record = {
      resource: { 'http://bibfra.me/vocab/lite/Instance': { profileId: 'profile-id' } },
    } as unknown as RecordEntry;

    const pipeline = makePipeline();

    await buildProcessedResource({
      pipeline,
      record,
      asClone: true,
      loadProfile: mockLoadProfile,
      loadProfileSettings: mockLoadProfileSettings,
    });

    expect(recordHelper.getAdjustedRecordContents as jest.Mock).toHaveBeenCalledWith(
      expect.objectContaining({ asClone: true }),
    );
  });

  it('uses rootEntry as the selected profile when provided', async () => {
    const rootEntry = [{ id: 'root-entry' }] as unknown as ProfileNode;

    (profileHelper.getProfileConfig as jest.Mock).mockReturnValue({
      ids: ['profile-id'],
      rootEntry,
    });

    const pipeline = makePipeline();

    const result = await buildProcessedResource({
      pipeline,
      loadProfile: mockLoadProfile,
      loadProfileSettings: mockLoadProfileSettings,
    });

    expect(result?.selectedProfile).toBeDefined();
    expect(pipeline.schemaGeneratorService.init).toHaveBeenCalledWith(
      expect.arrayContaining([rootEntry]),
      mockProfileSettings,
    );
  });
});
