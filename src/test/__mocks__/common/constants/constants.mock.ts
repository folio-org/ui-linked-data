type ConstantValue = string | number | object | boolean;

export const getMockedImportedConstant =
  (constantsModule: any, constantName: string) => (value: Record<string, ConstantValue> | ConstantValue) => {
    Object.defineProperty(constantsModule, constantName, {
      value,
      writable: true,
    });
  };
