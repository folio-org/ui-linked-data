import { BFLITE_URIS } from '@common/constants/bibframeMapping.constants';
import { ComplexLookupUserValueService } from '@common/services/userValues/userValueTypes';

describe('ComplexLookupUserValueService', () => {
  test('generates user value', () => {
    const complexLookupUserValueService = new ComplexLookupUserValueService();
    const testResult = {
      uuid: 'testUuid_1',
      contents: [
        {
          id: 'testId_1',
          label: 'test complex value 1',
          meta: {
            type: 'COMPLEX',
          },
        },
      ],
    };

    const result = complexLookupUserValueService.generate({
      id: 'testId_1',
      data: 'test complex value 1',
      uuid: 'testUuid_1',
      type: 'COMPLEX',
    });

    expect(result).toEqual(testResult);
  });

  test('generates user value with "data" as array of strings', () => {
    const complexLookupUserValueService = new ComplexLookupUserValueService();
    const testResult = {
      uuid: 'testUuid_1',
      contents: [
        {
          id: 'testId_1',
          label: 'test complex value 1',
          meta: {
            type: 'COMPLEX',
          },
        },
        {
          id: 'testId_1',
          label: 'test complex value 2',
          meta: {
            type: 'COMPLEX',
          },
        },
      ],
    };

    const result = complexLookupUserValueService.generate({
      id: 'testId_1',
      data: ['test complex value 1', 'test complex value 2'],
      uuid: 'testUuid_1',
      type: 'COMPLEX',
    });

    expect(result).toEqual(testResult);
  });

  test('generates user value with "data" as array of objects', () => {
    const complexLookupUserValueService = new ComplexLookupUserValueService();
    const testResult = {
      uuid: 'testUuid_1',
      contents: [
        {
          id: 'testId_1',
          label: 'test complex value 1',
          meta: {
            type: 'COMPLEX',
          },
        },
        {
          id: 'testId_2',
          label: 'test complex value 2',
          meta: {
            type: 'COMPLEX',
          },
        },
      ],
    };

    const result = complexLookupUserValueService.generate({
      id: 'testId_1',
      data: [
        { id: 'testId_1', label: ['test complex value 1'] },
        { id: 'testId_2', label: ['test complex value 2'] },
      ] as unknown as RecordBasic[],
      uuid: 'testUuid_1',
      type: 'COMPLEX',
    });

    expect(result).toEqual(testResult);
  });

  test('generates user value with Hub structure containing vocab lite properties', () => {
    const complexLookupUserValueService = new ComplexLookupUserValueService();

    // Mock data constants
    const mockUuid = 'test_uuid_hub';
    const mockHubId = 'mock_hub_id_123';
    const mockLabel = 'Mock Author Name, dates. Work Title';
    const mockUri = 'test_uri/mock_hub_id_123';
    const mockRelation = BFLITE_URIS.SUBJECT;

    const mockHubData = {
      _relation: mockRelation,
      _hub: {
        [BFLITE_URIS.LABEL]: [mockLabel],
        [BFLITE_URIS.LINK]: [mockUri],
      },
    } as unknown as RecordBasic;

    const expectedResult = {
      uuid: mockUuid,
      contents: [
        {
          id: mockHubId,
          label: mockLabel,
          meta: {
            type: 'COMPLEX',
            uri: mockUri,
            relation: mockRelation,
          },
        },
      ],
    };

    const result = complexLookupUserValueService.generate({
      id: 'defaultId',
      data: mockHubData,
      uuid: mockUuid,
      type: 'COMPLEX',
    });

    expect(result).toEqual(expectedResult);
  });

  test('generates user value with Creator structure containing _name field', () => {
    const complexLookupUserValueService = new ComplexLookupUserValueService();

    // Mock data constants
    const mockUuid = 'test_uuid_creator';
    const mockCreatorId = 'mock_creator_id_456';
    const mockCreatorName = 'Mock Organization Name';
    const mockSubclass = BFLITE_URIS.SUBJECT;

    const mockCreatorData = {
      id: [mockCreatorId],
      _name: {
        value: [mockCreatorName],
        isPreferred: true,
      },
      _subclass: mockSubclass,
    } as unknown as RecordBasic;

    const expectedResult = {
      uuid: mockUuid,
      contents: [
        {
          id: mockCreatorId,
          label: mockCreatorName,
          meta: {
            type: 'COMPLEX',
            isPreferred: true,
          },
        },
      ],
    };

    const result = complexLookupUserValueService.generate({
      id: 'defaultId',
      data: mockCreatorData,
      uuid: mockUuid,
      type: 'COMPLEX',
    });

    expect(result).toEqual(expectedResult);
  });
});
