import { cloneDeep } from 'lodash';
import { AdvancedFieldType as AdvancedFieldTypeEnum } from '@common/constants/uiControls.constants';
import { ComplexLookupUserValueService, LiteralUserValueService, SimpleLookupUserValueService } from './userValueTypes';
import { IUserValueType } from './userValueTypes/userValueType.interface';
import { IUserValues } from './userValues.interface';

export class UserValuesService implements IUserValues {
  private generatedValue?: UserValue;
  private type?: AdvancedFieldType;
  private key?: string;
  private value?: UserValueDTO;
  private userValueFactory?: IUserValueType;
  private literalUserValueService?: IUserValueType;
  private simpleLookupUserValueService?: IUserValueType;
  private complexLookupUserValueService?: IUserValueType;

  constructor(
    private userValues: UserValues,
    private apiClient: IApiClient,
    private cacheService: ILookupCacheService,
  ) {
    this.userValues = cloneDeep(userValues);

    this.initialize();
  }

  set(userValues: UserValues) {
    this.userValues = userValues;
  }

  async setValue({ type, key, value }: { type: AdvancedFieldType; key: string; value: UserValueDTO }) {
    this.type = type as AdvancedFieldType;
    this.key = key;
    this.value = value;

    this.selectFactoryByType();
    await this.generateValue();

    if (this.generatedValue) {
      this.userValues[key] = this.generatedValue;
    }
  }

  getAllValues() {
    return this.userValues;
  }

  getValue(key: string) {
    return this.userValues[key];
  }

  private initialize() {
    this.literalUserValueService = new LiteralUserValueService();
    this.simpleLookupUserValueService = new SimpleLookupUserValueService(this.apiClient, this.cacheService);
    this.complexLookupUserValueService = new ComplexLookupUserValueService();
  }

  private selectFactoryByType() {
    switch (this.type as AdvancedFieldTypeEnum) {
      case AdvancedFieldTypeEnum.literal:
        this.userValueFactory = this.literalUserValueService;
        break;
      case AdvancedFieldTypeEnum.simple:
        this.userValueFactory = this.simpleLookupUserValueService;
        break;
      case AdvancedFieldTypeEnum.complex:
        this.userValueFactory = this.complexLookupUserValueService;
        break;
      default:
        this.userValueFactory = this.literalUserValueService;
        break;
    }
  }

  private async generateValue() {
    try {
      const typedValue = { ...this.value } as UserValueDTO;
      this.generatedValue = await this.userValueFactory?.generate({ ...typedValue, uuid: this.key, type: this.type });
    } catch (error) {
      console.error(
        `Error occurred generating value for ${this.value?.fieldUri} field of the ${this.value?.groupUri} record entry`,
        error,
      );
    }
  }
}
