import { ComplexLookupUserValueService } from '@common/services/userValues/userValueTypes';

describe('ComplexLookupUserValueService', () => {
  test('generates user value', () => {
    const complexLookupUserValueService = new ComplexLookupUserValueService();
    const testResult = {
      uuid: 'testUuid_1',
      contents: [
        {
          label: 'test complex value 1',
        },
      ],
    };

    complexLookupUserValueService.generate({
      data: 'test complex value 1',
      uuid: 'testUuid_1',
    });
    const result = complexLookupUserValueService.getValue();

    expect(result).toEqual(testResult);
  });
});
