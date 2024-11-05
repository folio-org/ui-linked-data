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
});
