import { ComplexLookupUserValueService } from '@/common/services/userValues/userValueTypes';

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
            uri: undefined,
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
            uri: undefined,
          },
        },
        {
          id: 'testId_1',
          label: 'test complex value 2',
          meta: {
            type: 'COMPLEX',
            uri: undefined,
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
            uri: undefined,
          },
        },
        {
          id: 'testId_2',
          label: 'test complex value 2',
          meta: {
            type: 'COMPLEX',
            uri: undefined,
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

  test('generates user value with undefined URI', () => {
    const complexLookupUserValueService = new ComplexLookupUserValueService();
    const testResult = {
      uuid: 'testUuid_1',
      contents: [
        {
          id: 'testId_1',
          label: 'test complex value 1',
          meta: {
            type: 'COMPLEX',
            uri: undefined,
          },
        },
      ],
    };

    const result = complexLookupUserValueService.generate({
      id: 'testId_1',
      data: 'test complex value 1',
      uuid: 'testUuid_1',
      type: 'COMPLEX',
      uri: 'test_uri',
    });

    expect(result).toEqual(testResult);
  });

  test('generates user value with URI from data object', () => {
    const complexLookupUserValueService = new ComplexLookupUserValueService();
    const testResult = {
      uuid: 'testUuid_1',
      contents: [
        {
          id: 'testId_1',
          label: 'test complex value 1',
          meta: {
            type: 'COMPLEX',
            uri: 'test_data_uri',
          },
        },
      ],
    };

    const result = complexLookupUserValueService.generate({
      id: 'testId_1',
      data: {
        value: ['test complex value 1'],
        uri: 'test_data_uri',
      } as unknown as RecordBasic,
      uuid: 'testUuid_1',
      type: 'COMPLEX',
    });

    expect(result).toEqual(testResult);
  });

  test('generates user value with URI array from data object', () => {
    const complexLookupUserValueService = new ComplexLookupUserValueService();
    const testResult = {
      uuid: 'testUuid_1',
      contents: [
        {
          id: 'testId_1',
          label: 'test complex value 1',
          meta: {
            type: 'COMPLEX',
            uri: 'test_uri_1',
          },
        },
      ],
    };

    const result = complexLookupUserValueService.generate({
      id: 'testId_1',
      data: {
        value: ['test complex value 1'],
        uri: ['test_uri_1', 'test_uri_2'],
      } as unknown as RecordBasic,
      uuid: 'testUuid_1',
      type: 'COMPLEX',
    });

    expect(result).toEqual(testResult);
  });

  test('generates user value with sourceType from normalized hub data', () => {
    const complexLookupUserValueService = new ComplexLookupUserValueService();
    const testResult = {
      uuid: 'testUuid_1',
      contents: [
        {
          id: 'hub_id_123',
          label: 'Hub Label',
          meta: {
            type: 'COMPLEX',
            uri: 'test_uri',
            sourceType: 'libraryOfCongress',
          },
        },
      ],
    };

    const result = complexLookupUserValueService.generate({
      id: 'fallback_id',
      data: [
        {
          id: ['hub_id_123'],
          label: ['Hub Label'],
          uri: ['test_uri'],
          sourceType: 'libraryOfCongress',
        },
      ] as unknown as RecordBasic[],
      uuid: 'testUuid_1',
      type: 'COMPLEX',
    });

    expect(result).toEqual(testResult);
  });

  test('generates user value with internal id from normalized hub data (existing hub)', () => {
    const complexLookupUserValueService = new ComplexLookupUserValueService();
    const testResult = {
      uuid: 'testUuid_1',
      contents: [
        {
          id: 'internal_hub_id_456',
          label: 'Existing Hub',
          meta: {
            type: 'COMPLEX',
            uri: 'test_uri',
            sourceType: 'libraryOfCongress',
          },
        },
      ],
    };

    const result = complexLookupUserValueService.generate({
      id: 'fallback_id',
      data: [
        {
          id: ['internal_hub_id_456'],
          label: ['Existing Hub'],
          uri: ['test_uri'],
          sourceType: 'libraryOfCongress',
        },
      ] as unknown as RecordBasic[],
      uuid: 'testUuid_1',
      type: 'COMPLEX',
    });

    expect(result).toEqual(testResult);
  });

  test('generates user value from normalized hub data with value property (single object)', () => {
    const complexLookupUserValueService = new ComplexLookupUserValueService();
    const testResult = {
      uuid: 'hub_uuid',
      contents: [
        {
          id: 'hub_id_123',
          label: 'Hub Label',
          meta: {
            type: 'COMPLEX',
            uri: 'http://id.loc.gov/resources/hubs/abc',
            sourceType: 'libraryOfCongress',
          },
        },
      ],
    };

    const result = complexLookupUserValueService.generate({
      id: 'fallback_id',
      data: {
        value: ['Hub Label'],
        uri: ['http://id.loc.gov/resources/hubs/abc'],
        id: ['hub_id_123'],
        sourceType: 'libraryOfCongress',
      } as unknown as RecordBasic,
      uuid: 'hub_uuid',
      type: 'COMPLEX',
    });

    expect(result).toEqual(testResult);
  });

  test('generates user value from normalized hub data for local source (single object)', () => {
    const complexLookupUserValueService = new ComplexLookupUserValueService();
    const testResult = {
      uuid: 'hub_uuid',
      contents: [
        {
          id: 'local_hub_id',
          label: 'Local Hub Label',
          meta: {
            type: 'COMPLEX',
            uri: undefined,
            sourceType: 'local',
          },
        },
      ],
    };

    const result = complexLookupUserValueService.generate({
      id: 'fallback_id',
      data: {
        value: ['Local Hub Label'],
        uri: [],
        id: ['local_hub_id'],
        sourceType: 'local',
      } as unknown as RecordBasic,
      uuid: 'hub_uuid',
      type: 'COMPLEX',
    });

    expect(result).toEqual(testResult);
  });
});
