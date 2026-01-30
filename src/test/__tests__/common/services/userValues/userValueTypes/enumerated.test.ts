import { AdvancedFieldType } from '@/common/constants/uiControls.constants';
import { EnumeratedUserValueService } from '@/common/services/userValues/userValueTypes';
import { IUserValueType } from '@/common/services/userValues/userValueTypes/userValueType.interface';

describe('EnumeratedUserValueService', () => {
  let enumeratedUserValueService: IUserValueType;

  beforeEach(() => {
    enumeratedUserValueService = new EnumeratedUserValueService();
  });

  async function testGeneratedData(data: string | string[], uuid?: string) {
    const testResult = {
      uuid: uuid ?? '',
      contents: [
        {
          label: 'testValue_1',
          meta: {
            basicLabel: 'testValue_1',
            type: 'enumerated',
            uri: 'testValue_1',
          },
        },
      ],
    };

    const result = await enumeratedUserValueService.generate({
      data,
      uuid,
      type: AdvancedFieldType.enumerated,
    });

    expect(result).toEqual(testResult);
  }

  test('generates user value for string data', () => {
    testGeneratedData('testValue_1', 'testUuid_1');
  });

  test('generates user value for array data', () => {
    testGeneratedData(['testValue_1']);
  });
});
