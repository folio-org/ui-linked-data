import { LiteralUserValueService } from '@/common/services/userValues/userValueTypes';
import { IUserValueType } from '@/common/services/userValues/userValueTypes/userValueType.interface';

describe('LiteralUserValueService', () => {
  let literalUserValueService: IUserValueType;

  beforeEach(() => {
    literalUserValueService = new LiteralUserValueService();
  });

  function testGeneratedData(data: string | string[], uuid?: string) {
    const testResult = {
      uuid: uuid ?? '',
      contents: [
        {
          label: 'test value 1',
        },
      ],
    };

    const result = literalUserValueService.generate({
      data,
      uuid,
    });

    expect(result).toEqual(testResult);
  }

  test('generates user value for string data', () => {
    testGeneratedData('test value 1', 'testUuid_1');
  });

  test('generates user value for array data', () => {
    testGeneratedData(['test value 1']);
  });
});
