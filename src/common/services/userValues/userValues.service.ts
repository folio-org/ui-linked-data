import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import { ComplexLookupUserValueService, LiteralUserValueService, SimpleLookupUserValueService } from './userValueTypes';
import { IUserValueType } from './userValueTypes/userValueType.interface';
import { IUserValues } from './userValues.interface';

export class UserValuesService implements IUserValues {
  private userValues: any;
  private generatedValue: any;
  private type?: AdvancedFieldType;
  private key?: string;
  private value?: any;
  private userValueFactory?: IUserValueType;
  private literalUserValueService?: IUserValueType;
  private simpleLookupUserValueService?: IUserValueType;
  private complexLookupUserValueService?: IUserValueType;

  constructor(userValues: any) {
    this.type = undefined;
    this.value = undefined;
    this.userValues = userValues;

    this.initialize();
  }

  async setValue({ type, key, value }: { type: AdvancedFieldType; key: string; value: any }) {
    this.type = type;
    this.key = key;
    this.value = value;

    this.selectFactoryByType();
    await this.generateValue();

    this.userValues[key] = this.generatedValue;
  }

  getAllValues() {
    return this.userValues;
  }

  getValue(key: string) {
    return this.userValues[key];
  }

  private initialize() {
    this.literalUserValueService = new LiteralUserValueService();
    this.simpleLookupUserValueService = new SimpleLookupUserValueService();
    this.complexLookupUserValueService = new ComplexLookupUserValueService();
  }

  private selectFactoryByType() {
    switch (this.type) {
      case AdvancedFieldType.literal:
        this.userValueFactory = this.literalUserValueService;
        break;
      case AdvancedFieldType.simple:
        this.userValueFactory = this.simpleLookupUserValueService;
        break;
      case AdvancedFieldType.complex:
        this.userValueFactory = this.complexLookupUserValueService;
        break;
      default:
        this.userValueFactory = this.literalUserValueService;
        break;
    }
  }

  private async generateValue() {
    await this.userValueFactory?.generate({ ...this.value, uuid: this.key, type: this.type });

    this.generatedValue = this.userValueFactory?.getValue();
  }
}
