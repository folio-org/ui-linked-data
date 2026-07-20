import { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';

import { getEditingRecordBlocks } from '@/common/helpers/record.helper';

import * as buildProcessedResourceModule from '../helpers/buildProcessedResource';
import { useResourceProcessing } from './useResourceProcessing';

jest.mock('react-router-dom', () => ({
  useSearchParams: () => [new URLSearchParams('type=work&profileId=123'), jest.fn()],
}));

jest.mock('../helpers/buildProcessedResource', () => ({
  buildProcessedResource: jest.fn(),
}));

jest.mock('@/common/services/pipeline', () => ({
  createSchemaPipeline: () => ({ schemaGeneratorService: {} }),
}));

jest.mock('@/contexts', () => ({
  SharedInfraContext: { _currentValue: {} },
}));

jest.mock('@/features/profiles', () => ({
  useLoadProfile: () => ({ loadProfile: jest.fn() }),
  useLoadProfileSettings: () => ({ loadProfileSettings: jest.fn() }),
}));

jest.mock('react-intl', () => ({
  useIntl: () => ({ formatMessage: (id: unknown) => id }),
}));

jest.mock('@/common/helpers/record.helper', () => ({
  getEditingRecordBlocks: jest.fn(),
}));

jest.mock('@/common/helpers/recordFormatting.helper', () => ({
  applyIntlToTemplates: () => [],
}));

const mockProcessedResource = { schema: {}, userValues: {} } as unknown as import('../types').ProcessedResource;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useResourceProcessing', () => {
  let wrapper: ReturnType<typeof createWrapper>;

  beforeEach(() => {
    wrapper = createWrapper();
    (buildProcessedResourceModule.buildProcessedResource as jest.Mock).mockResolvedValue(mockProcessedResource);
    (getEditingRecordBlocks as jest.Mock).mockReturnValue(undefined);
  });

  it('calls buildProcessedResource with typeParam, profileIdParam from URL', async () => {
    const { result } = renderHook(() => useResourceProcessing(), { wrapper });

    await result.current.processResource({});

    expect(buildProcessedResourceModule.buildProcessedResource).toHaveBeenCalledWith(
      expect.objectContaining({
        typeParam: 'work',
        profileIdParam: '123',
      }),
    );
  });

  it('forwards record to buildProcessedResource', async () => {
    const record = { resource: { key: 'value' } } as unknown as RecordEntry;
    const { result } = renderHook(() => useResourceProcessing(), { wrapper });

    await result.current.processResource({ record });

    expect(buildProcessedResourceModule.buildProcessedResource).toHaveBeenCalledWith(
      expect.objectContaining({ record }),
    );
  });

  it('passes templateMetadata for asClone with a block', async () => {
    const block = 'http://bibfra.me/vocab/lite/Instance';
    const record = { resource: { [block]: {} } } as unknown as RecordEntry;
    (getEditingRecordBlocks as jest.Mock).mockReturnValue({ block });

    const { result } = renderHook(() => useResourceProcessing(), { wrapper });

    await result.current.processResource({ record, asClone: true });

    expect(buildProcessedResourceModule.buildProcessedResource).toHaveBeenCalledWith(
      expect.objectContaining({
        asClone: true,
        templateMetadata: expect.any(Array),
      }),
    );
  });

  it('passes undefined templateMetadata for asClone without a block', async () => {
    const { result } = renderHook(() => useResourceProcessing(), { wrapper });

    await result.current.processResource({ asClone: true });

    expect(buildProcessedResourceModule.buildProcessedResource).toHaveBeenCalledWith(
      expect.objectContaining({
        asClone: true,
        templateMetadata: undefined,
      }),
    );
  });

  it('returns the result from buildProcessedResource', async () => {
    const { result } = renderHook(() => useResourceProcessing(), { wrapper });

    const output = await result.current.processResource({});

    expect(output).toBe(mockProcessedResource);
  });
});
