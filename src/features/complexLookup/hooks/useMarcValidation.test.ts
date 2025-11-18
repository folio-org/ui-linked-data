import { renderHook } from '@testing-library/react';
import { useMarcValidation } from '@/features/complexLookup/hooks/useMarcValidation';
import { useApi } from '@common/hooks/useApi';
import { generateValidationRequestBody } from '@/features/complexLookup/utils/complexLookup.helper';
import { AUTHORITY_ASSIGNMENT_CHECK_API_ENDPOINT } from '@common/constants/api.constants';

jest.mock('@common/hooks/useApi');
jest.mock('@/features/complexLookup/utils/complexLookup.helper');

describe('useMarcValidation', () => {
  const mockMakeRequest = jest.fn();

  beforeEach(() => {
    (useApi as jest.Mock).mockReturnValue({
      makeRequest: mockMakeRequest,
    });

    (generateValidationRequestBody as jest.Mock).mockReturnValue({
      rawMarc: 'test-raw-marc',
      target: 'CreatorOfWork',
    });
  });

  test('returns validateMarcRecord function', () => {
    const { result } = renderHook(() => useMarcValidation());

    expect(typeof result.current.validateMarcRecord).toBe('function');
  });

  test('validateMarcRecord calls makeRequest with correct parameters', async () => {
    const mockMarcData = {
      parsedRecord: { content: { test: 'data' } },
    } as unknown as MarcDTO;

    const mockLookupConfig = {
      api: {
        endpoints: {
          validation: 'custom-validation-endpoint',
        },
        validationTarget: {
          creator: 'CreatorOfWork',
        },
      },
    } as unknown as ComplexLookupsConfigEntry;

    const mockAuthority = 'creator';

    mockMakeRequest.mockResolvedValue({
      validAssignment: true,
    });

    const { result } = renderHook(() => useMarcValidation());

    await result.current.validateMarcRecord(mockMarcData, mockLookupConfig, mockAuthority);

    expect(generateValidationRequestBody).toHaveBeenCalledWith(mockMarcData, 'CreatorOfWork');

    expect(mockMakeRequest).toHaveBeenCalledWith({
      url: 'custom-validation-endpoint',
      method: 'POST',
      body: {
        rawMarc: 'test-raw-marc',
        target: 'CreatorOfWork',
      },
    });
  });

  test('validateMarcRecord uses default endpoint when validation endpoint is not provided', async () => {
    const mockMarcData = {
      parsedRecord: { content: { test: 'data' } },
    } as unknown as MarcDTO;

    const mockLookupConfig = {
      api: {
        endpoints: {},
        validationTarget: {
          creator: 'CreatorOfWork',
        },
      },
    } as unknown as ComplexLookupsConfigEntry;

    const mockAuthority = 'creator';

    const { result } = renderHook(() => useMarcValidation());

    await result.current.validateMarcRecord(mockMarcData, mockLookupConfig, mockAuthority);

    expect(mockMakeRequest).toHaveBeenCalledWith({
      url: AUTHORITY_ASSIGNMENT_CHECK_API_ENDPOINT,
      method: 'POST',
      body: {
        rawMarc: 'test-raw-marc',
        target: 'CreatorOfWork',
      },
    });
  });

  test('validateMarcRecord returns the response from makeRequest', async () => {
    const mockResponse = {
      validAssignment: false,
      invalidAssignmentReason: 'invalid_format',
    };

    mockMakeRequest.mockResolvedValue(mockResponse);

    const mockMarcData = {
      parsedRecord: { content: { test: 'data' } },
    } as unknown as MarcDTO;

    const mockLookupConfig = {
      api: {
        endpoints: {
          validation: 'test-endpoint',
        },
        validationTarget: {
          creator: 'CreatorOfWork',
        },
      },
    } as unknown as ComplexLookupsConfigEntry;

    const { result } = renderHook(() => useMarcValidation());

    const response = await result.current.validateMarcRecord(mockMarcData, mockLookupConfig, 'creator');

    expect(response).toEqual(mockResponse);
  });
});
