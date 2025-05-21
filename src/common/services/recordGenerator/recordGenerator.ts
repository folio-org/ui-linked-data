import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import { RecordModelType } from '@common/constants/recordModel.constants';
import { IRecordGenerator } from './recordGenerator.interface';

export class RecordGenerator implements IRecordGenerator {
  private schema: Map<string, SchemaEntry>;
  private model: RecordModel;
  private userValues: UserValues;
  private pathToEntry: Map<string, SchemaEntry>;
  private cachedSchemaValues: SchemaEntry[] | null = null;
  private uriBFLiteIndex: Map<string, SchemaEntry[]> | null = null;

  constructor() {
    this.schema = new Map();
    this.model = {};
    this.userValues = {};
    this.pathToEntry = new Map();
    this.cachedSchemaValues = null;
    this.uriBFLiteIndex = null;
  }

  generate(data: { schema: Schema; model: RecordModel; userValues: UserValues }) {
    this.init(data);

    const result: Record<string, any> = {
      resource: {},
    };

    for (const [rootKey, rootField] of Object.entries(this.model)) {
      const rootEntries = this.findSchemaEntriesByUriBFLite(rootKey);

      for (const entry of rootEntries) {
        const { value } = this.generateValueFromModel(rootField, entry);

        if (value && (Array.isArray(value) ? value.length > 0 : true)) {
          result.resource[rootKey] = value;
        }
      }
    }

    return result;
  }

  private init({ schema, model, userValues }: { schema: Schema; model: RecordModel; userValues: UserValues }) {
    this.schema = schema;
    this.cachedSchemaValues = null;
    this.uriBFLiteIndex = null;
    this.buildPathMap();

    this.model = model;
    this.userValues = userValues;
    this.pathToEntry = new Map();
  }

  private buildPathMap() {
    for (const entry of this.schema.values()) {
      const pathKey = entry.path.join('::');

      this.pathToEntry.set(pathKey, entry);
    }
  }

  private findSchemaEntriesByUriBFLite(uriBFLite: string) {
    if (this.uriBFLiteIndex === null) {
      this.buildUriBFLiteIndex();
    }

    return this.uriBFLiteIndex?.get(uriBFLite) || [];
  }

  // Builds an index of schema entries grouped by their uriBFLite value
  // This improves the performance of lookups by uriBFLite
  private buildUriBFLiteIndex() {
    this.uriBFLiteIndex = new Map();

    this.cachedSchemaValues ??= Array.from(this.schema.values());

    for (const entry of this.cachedSchemaValues) {
      if (!entry.uriBFLite) continue;

      const currentEntries = this.uriBFLiteIndex.get(entry.uriBFLite);

      if (currentEntries) {
        currentEntries.push(entry);
      } else {
        this.uriBFLiteIndex.set(entry.uriBFLite, [entry]);
      }
    }
  }

  private processDropdownStructure(dropdownEntry: SchemaEntry) {
    const results: Array<Record<string, any>> = [];

    if (!dropdownEntry.children) return results;

    for (const optionUuid of dropdownEntry.children) {
      const optionEntry = this.schema.get(optionUuid);

      if (!optionEntry?.children) continue;

      if (!this.hasOptionValues(optionEntry)) continue;

      const result = this.processOptionEntry(optionEntry);

      if (result) {
        results.push(result);
      }
    }

    return results;
  }

  private hasOptionValues(optionEntry: SchemaEntry) {
    return !!optionEntry.children?.some(childUuid => {
      const childEntry = this.schema.get(childUuid);

      return !!childEntry && !!this.userValues[childEntry.uuid]?.contents?.length;
    });
  }

  private processOptionEntry(optionEntry: SchemaEntry) {
    if (!optionEntry.uriBFLite) return null;

    const structureResult = this.buildOptionStructure(optionEntry);

    if (Object.keys(structureResult).length === 0) return null;

    const result: Record<string, any> = {};
    result[optionEntry.uriBFLite] = structureResult;

    return result;
  }

  private buildOptionStructure(optionEntry: SchemaEntry) {
    const structureResult: Record<string, any> = {};

    if (!optionEntry.children) {
      return structureResult;
    }

    for (const optionChildUuid of optionEntry.children) {
      this.processChildAndAddToStructure(optionChildUuid, structureResult);
    }

    return structureResult;
  }

  private processChildAndAddToStructure(childUuid: string, structureResult: Record<string, any>) {
    const childEntry = this.schema.get(childUuid);

    if (!childEntry) return;

    const childValues = this.userValues[childEntry.uuid]?.contents || [];

    if (childValues.length === 0 || !childEntry.uriBFLite) return;

    if (childEntry.type === AdvancedFieldType.literal) {
      structureResult[childEntry.uriBFLite] = childValues.map(({ label }) => label);
    } else if (childEntry.type === AdvancedFieldType.simple) {
      structureResult[childEntry.uriBFLite] = childValues.map(({ meta, label }) => ({
        // TODO: take field names from the model
        'http://bibfra.me/vocab/lite/link': [meta?.uri],
        'http://bibfra.me/vocab/lite/label': [meta?.basicLabel ?? label],
      }));
    }
  }

  private isUnwrappedDropdownOption(modelField: RecordModelField, schemaEntry: SchemaEntry): boolean {
    return schemaEntry.type === AdvancedFieldType.dropdown && modelField.options?.hiddenWrapper === true;
  }

  private processUnwrappedDropdownStructure(dropdownEntry: SchemaEntry) {
    const results: any[] = [];

    if (!dropdownEntry.children) return results;

    for (const optionUuid of dropdownEntry.children) {
      const optionEntry = this.schema.get(optionUuid);

      if (!optionEntry?.children || !this.hasOptionValues(optionEntry)) continue;

      const result = this.processUnwrappedOptionEntry(optionEntry);

      if (result) {
        results.push(result);
      }
    }

    return results;
  }

  private processUnwrappedOptionEntry(optionEntry: SchemaEntry) {
    if (!optionEntry.uriBFLite) return null;

    const wrappedResult = this.buildUnwrappedStructure(optionEntry);

    if (Object.keys(wrappedResult).length === 0) return null;

    // Use the dropdown option's uriBFLite (e.g. distribution) instead of provisionActivity
    return {
      [optionEntry.uriBFLite]: [wrappedResult],
    };
  }

  private buildUnwrappedStructure(optionEntry: SchemaEntry) {
    const wrappedResult: Record<string, any> = {};

    if (!optionEntry.children) return wrappedResult;

    for (const childUuid of optionEntry.children) {
      this.processUnwrappedChildAndAddToStructure(childUuid, wrappedResult);
    }

    return wrappedResult;
  }

  private processUnwrappedChildAndAddToStructure(childUuid: string, wrappedResult: Record<string, any>) {
    const childEntry = this.schema.get(childUuid);

    if (!childEntry) return;

    const childValues = this.userValues[childEntry.uuid]?.contents || [];

    if (childValues.length === 0 || !childEntry.uriBFLite) return;

    if (childEntry.type === AdvancedFieldType.literal) {
      wrappedResult[childEntry.uriBFLite] = childValues.map(({ label }) => label);
    } else if (childEntry.type === AdvancedFieldType.simple) {
      // TODO: take field names from the model
      wrappedResult[childEntry.uriBFLite] = childValues.map(({ meta, label }) => ({
        'http://bibfra.me/vocab/lite/name': [meta?.basicLabel ?? label],
        'http://bibfra.me/vocab/marc/code': [meta?.uri?.split('/').pop()],
        'http://bibfra.me/vocab/lite/label': [meta?.basicLabel ?? label],
        'http://bibfra.me/vocab/lite/link': [meta?.uri],
      }));
    }
  }

  private generateValueFromModel(modelField: RecordModelField, schemaEntry: SchemaEntry) {
    const options: any = {}; // TODO: Can be populated with metadata/options if needed

    // Handle dropdown cases
    if (this.isUnwrappedDropdownOption(modelField, schemaEntry)) {
      options.hiddenWrapper = true;

      return { value: this.processUnwrappedDropdownStructure(schemaEntry), options };
    }

    if (schemaEntry.type === AdvancedFieldType.dropdown) {
      return { value: this.processDropdownStructure(schemaEntry), options };
    }

    // Handle non-dropdown cases
    const values = this.userValues[schemaEntry.uuid]?.contents || [];

    if (modelField.type === RecordModelType.array) {
      return { value: this.processArrayType(modelField, schemaEntry, values), options };
    }

    if (modelField.type === RecordModelType.object && modelField.fields) {
      return { value: this.processObjectType(modelField), options };
    }

    // Default case for simple fields
    return { value: values.map(({ label }) => label), options };
  }

  private processArrayType(modelField: RecordModelField, schemaEntry: SchemaEntry, values: any[]) {
    if (modelField.value === RecordModelType.string) {
      return values.map(({ label }) => label);
    }

    if (
      modelField.value === RecordModelType.object &&
      (schemaEntry.type === AdvancedFieldType.complex || schemaEntry.type === AdvancedFieldType.simple)
    ) {
      return this.processComplexArrayObjects(modelField, values);
    }

    return null;
  }

  private processComplexArrayObjects(modelField: RecordModelField, values: any[]) {
    return values.map(({ meta, label }) => {
      const result: Record<string, any> = {};

      if (!modelField.fields) return result;

      for (const key of Object.keys(modelField.fields)) {
        if (meta?.uri && key.includes('link')) {
          result[key] = [meta.uri];
        } else if (meta?.basicLabel && key.includes('term')) {
          result[key] = [meta.basicLabel];
        } else if (key.includes('code')) {
          result[key] = [meta?.uri?.split('/').pop() ?? label];
        } else {
          result[key] = [label];
        }
      }
      return result;
    });
  }

  private processObjectType(modelField: RecordModelField) {
    const result: Record<string, any> = {};

    if (!modelField.fields) return null;

    for (const [key, field] of Object.entries(modelField.fields)) {
      this.processObjectField(key, field, result);
    }

    return Object.keys(result).length > 0 ? result : null;
  }

  private processObjectField(key: string, field: RecordModelField, result: Record<string, any>) {
    const childEntries = this.findSchemaEntriesByUriBFLite(key);

    for (const childEntry of childEntries) {
      const childResult = this.generateValueFromModel(field, childEntry);

      if (!childResult.value) continue;

      if (field.type === RecordModelType.array) {
        this.processArrayField(key, childResult, result);
      } else {
        result[key] = childResult.value;
      }
    }
  }

  private processArrayField(key: string, childResult: { value: any; options: any }, result: Record<string, any>) {
    if (childResult.options.hiddenWrapper) {
      Object.assign(result, childResult.value[0]);
    } else {
      result[key] = result[key] ?? [];
      result[key] = result[key].concat(childResult.value);
    }
  }
}
