import { Profile } from '../../../data/profile-schema_updated';
import { model, Model, ModelField } from './model';
import { userValues } from './userValues';

// TODO: add functionality to handle new record generation logic for Complex lookup fields
class RecordGenerator {
  private readonly schema: Map<string, SchemaEntry>;
  private readonly model: Model;
  private readonly userValues: UserValues;
  private readonly pathToEntry: Map<string, SchemaEntry>;

  constructor(schema: SchemaEntry[], model: Model, userValues: UserValues) {
    this.schema = new Map(schema.map(entry => [entry.uuid, entry]));
    this.model = model;
    this.userValues = userValues;
    this.pathToEntry = new Map();
    this.buildPathMap();
  }

  private buildPathMap() {
    for (const entry of this.schema.values()) {
      const pathKey = entry.path.join('::');
      this.pathToEntry.set(pathKey, entry);
    }
  }

  private findSchemaEntriesByUriBFLite(uriBFLite: string): SchemaEntry[] {
    return Array.from(this.schema.values()).filter(entry => entry.uriBFLite === uriBFLite);
  }

  private processDropdownStructure(dropdownEntry: SchemaEntry): any[] {
    const results: any[] = [];

    if (!dropdownEntry.children) return results;

    // Find selected options by checking their children's values
    for (const optionUuid of dropdownEntry.children) {
      const optionEntry = this.schema.get(optionUuid);
      if (!optionEntry || !optionEntry.children) continue;

      // Check if this option has any values in its children
      const hasValues = optionEntry.children.some(childUuid => {
        const childEntry = this.schema.get(childUuid);
        return childEntry && this.userValues[childEntry.uuid]?.contents?.length > 0;
      });

      if (!hasValues) continue;

      // Process the option's children to build the structure
      const result: any = {};
      if (optionEntry.uriBFLite) {
        const structureResult: any = {};

        // Process each child of the selected option
        for (const optionChildUuid of optionEntry.children) {
          const childEntry = this.schema.get(optionChildUuid);
          if (!childEntry) continue;

          const childValues = this.userValues[childEntry.uuid]?.contents || [];
          if (childValues.length === 0) continue;

          if (childEntry.uriBFLite) {
            if (childEntry.type === 'literal') {
              structureResult[childEntry.uriBFLite] = childValues.map(v => v.label);
            } else if (childEntry.type === 'simple') {
              structureResult[childEntry.uriBFLite] = childValues.map(v => ({
                // TODO: take field names from the model
                'http://bibfra.me/vocab/lite/link': [v.meta?.uri],
                'http://bibfra.me/vocab/lite/label': [v.meta?.basicLabel || v.label],
              }));
            }
          }
        }

        if (Object.keys(structureResult).length > 0) {
          result[optionEntry.uriBFLite] = structureResult;
          results.push(result);
        }
      }
    }

    return results;
  }

  private isUnwrappedDropdownOption(modelField: ModelField, schemaEntry: SchemaEntry): boolean {
    return schemaEntry.type === 'dropdown' && modelField.options?.hiddenWrapper === true;
  }

  private processUnwrappedDropdownStructure(dropdownEntry: SchemaEntry): any[] {
    const results: any[] = [];

    if (!dropdownEntry.children) return results;

    for (const optionUuid of dropdownEntry.children) {
      const optionEntry = this.schema.get(optionUuid);
      if (!optionEntry?.children) continue;

      // Check if any child has values
      const hasValues = optionEntry.children.some(childUuid => {
        const childEntry = this.schema.get(childUuid);
        return childEntry && this.userValues[childEntry.uuid]?.contents?.length > 0;
      });

      if (!hasValues) continue;

      const wrappedResult: any = {};

      for (const childUuid of optionEntry.children) {
        const childEntry = this.schema.get(childUuid);
        if (!childEntry) continue;

        const childValues = this.userValues[childEntry.uuid]?.contents || [];
        if (childValues.length === 0) continue;

        if (childEntry.uriBFLite) {
          if (childEntry.type === 'literal') {
            wrappedResult[childEntry.uriBFLite] = childValues.map(v => v.label);
          } else if (childEntry.type === 'simple') {
            // TODO: take field names from the model
            wrappedResult[childEntry.uriBFLite] = childValues.map(v => ({
              'http://bibfra.me/vocab/lite/name': [v.meta?.basicLabel || v.label],
              'http://bibfra.me/vocab/marc/code': [v.meta?.uri?.split('/').pop()],
              'http://bibfra.me/vocab/lite/label': [v.meta?.basicLabel || v.label],
              'http://bibfra.me/vocab/lite/link': [v.meta?.uri],
            }));
          }
        }
      }

      if (Object.keys(wrappedResult).length > 0) {
        // Use the dropdown option's uriBFLite (e.g. distribution) instead of provisionActivity
        const result = {
          [optionEntry.uriBFLite]: [wrappedResult],
        };
        results.push(result);
      }
    }

    return results;
  }

  private generateValueFromModel(modelField: ModelField, schemaEntry: SchemaEntry): { value: any; options: any } {
    let generatedValue: any;
    const options: any = {}; // Can be populated with metadata/options if needed

    if (this.isUnwrappedDropdownOption(modelField, schemaEntry)) {
      options.hiddenWrapper = true;
      generatedValue = this.processUnwrappedDropdownStructure(schemaEntry);
    } else if (schemaEntry.type === 'dropdown') {
      generatedValue = this.processDropdownStructure(schemaEntry);
    } else {
      const values = this.userValues[schemaEntry.uuid]?.contents || [];

      if (modelField.type === 'array') {
        if (modelField.value === 'string') {
          generatedValue = values.map(v => v.label);
        } else if (modelField.value === 'object') {
          if (schemaEntry.type === 'complex' || schemaEntry.type === 'simple') {
            generatedValue = values.map(v => {
              const result: Record<string, any> = {};
              if (modelField.fields) {
                for (const key of Object.keys(modelField.fields)) {
                  if (v.meta?.uri && key.includes('link')) {
                    result[key] = [v.meta.uri];
                  } else if (v.meta?.basicLabel && key.includes('term')) {
                    result[key] = [v.meta.basicLabel];
                  } else if (key.includes('code')) {
                    result[key] = [v.meta?.uri?.split('/').pop() || v.label];
                  } else {
                    result[key] = [v.label];
                  }
                }
              }
              return result;
            });
          }
        }
      } else if (modelField.type === 'object' && modelField.fields) {
        let result: Record<string, any> = {};

        for (const [key, field] of Object.entries(modelField.fields)) {
          const childEntries = this.findSchemaEntriesByUriBFLite(key);

          for (const childEntry of childEntries) {
            const childResult = this.generateValueFromModel(field, childEntry);
            if (childResult.value) {
              if (field.type === 'array') {
                if (childResult.options.hiddenWrapper) {
                  result = { ...result, ...childResult.value[0] };
                } else {
                  result[key] = result[key] || [];
                  result[key] = result[key].concat(childResult.value);
                }
              } else {
                result[key] = childResult.value;
              }
            }
          }
        }

        generatedValue = Object.keys(result).length > 0 ? result : null;
      } else {
        generatedValue = values.map(v => v.label);
      }
    }

    return { value: generatedValue, options: options };
  }

  generate(): Record<string, any> {
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
}

const generator = new RecordGenerator(Profile as SchemaEntry[], model, userValues);
const record = generator.generate();

console.log('====================================');
console.log('Generated record', record);
console.log('====================================');
