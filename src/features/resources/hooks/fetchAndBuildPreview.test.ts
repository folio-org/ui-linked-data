import * as pipelineModule from '@/common/services/pipeline';

import * as recordsApi from '../api/records.api';
import * as buildProcessedResourceModule from '../helpers/buildProcessedResource';
import { fetchAndBuildPreview } from './fetchAndBuildPreview';

jest.mock('../api/records.api', () => ({
  getRecord: jest.fn(),
}));

jest.mock('@/common/services/pipeline', () => ({
  createSchemaPipeline: jest.fn(),
}));

jest.mock('../helpers/buildProcessedResource', () => ({
  buildProcessedResource: jest.fn(),
}));

const mockSignal = { aborted: false } as AbortSignal;
const mockSharedInfra = {} as SharedInfraServices;
const mockLoadProfile = jest.fn();
const mockLoadProfileSettings = jest.fn();
const mockPipeline = { schemaGeneratorService: {} } as unknown as SchemaPipelineServices;
const mockProcessedResource = { schema: {}, userValues: {} } as unknown as import('../types').ProcessedResource;

describe('fetchAndBuildPreview', () => {
  beforeEach(() => {
    (pipelineModule.createSchemaPipeline as jest.Mock).mockReturnValue(mockPipeline);
    (buildProcessedResourceModule.buildProcessedResource as jest.Mock).mockResolvedValue(mockProcessedResource);
  });

  it('returns null when getRecord returns null', async () => {
    (recordsApi.getRecord as jest.Mock).mockResolvedValue(null);

    const result = await fetchAndBuildPreview({
      resourceId: 'res-1',
      signal: mockSignal,
      sharedInfra: mockSharedInfra,
      loadProfile: mockLoadProfile,
      loadProfileSettings: mockLoadProfileSettings,
    });

    expect(result).toBeNull();
    expect(buildProcessedResourceModule.buildProcessedResource).not.toHaveBeenCalled();
  });

  it('calls buildProcessedResource with the fetched record and returns its result', async () => {
    const mockRecord = { resource: { key: 'value' } };
    (recordsApi.getRecord as jest.Mock).mockResolvedValue(mockRecord);

    const result = await fetchAndBuildPreview({
      resourceId: 'res-1',
      signal: mockSignal,
      sharedInfra: mockSharedInfra,
      loadProfile: mockLoadProfile,
      loadProfileSettings: mockLoadProfileSettings,
    });

    expect(buildProcessedResourceModule.buildProcessedResource).toHaveBeenCalledWith(
      expect.objectContaining({
        pipeline: mockPipeline,
        record: mockRecord,
        loadProfile: mockLoadProfile,
        loadProfileSettings: mockLoadProfileSettings,
      }),
    );
    expect(result).toBe(mockProcessedResource);
  });

  it('forwards the abort signal to getRecord', async () => {
    (recordsApi.getRecord as jest.Mock).mockResolvedValue({ resource: {} });

    await fetchAndBuildPreview({
      resourceId: 'res-1',
      signal: mockSignal,
      sharedInfra: mockSharedInfra,
      loadProfile: mockLoadProfile,
      loadProfileSettings: mockLoadProfileSettings,
    });

    expect(recordsApi.getRecord).toHaveBeenCalledWith(expect.objectContaining({ signal: mockSignal }));
  });

  it('forwards idType to getRecord', async () => {
    (recordsApi.getRecord as jest.Mock).mockResolvedValue({ resource: {} });

    await fetchAndBuildPreview({
      resourceId: 'res-1',
      signal: mockSignal,
      sharedInfra: mockSharedInfra,
      loadProfile: mockLoadProfile,
      loadProfileSettings: mockLoadProfileSettings,
      idType: 'INVENTORY_ID' as import('@/common/constants/api.constants').ExternalResourceIdType,
    });

    expect(recordsApi.getRecord).toHaveBeenCalledWith(expect.objectContaining({ idType: 'INVENTORY_ID' }));
  });

  it('creates a transient pipeline from sharedInfra', async () => {
    (recordsApi.getRecord as jest.Mock).mockResolvedValue({ resource: {} });

    await fetchAndBuildPreview({
      resourceId: 'res-1',
      signal: mockSignal,
      sharedInfra: mockSharedInfra,
      loadProfile: mockLoadProfile,
      loadProfileSettings: mockLoadProfileSettings,
    });

    expect(pipelineModule.createSchemaPipeline).toHaveBeenCalledWith(mockSharedInfra);
  });
});
