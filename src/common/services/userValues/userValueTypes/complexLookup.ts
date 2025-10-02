import { BASE_COMPLEX_LOOKUP_CONFIG } from './configs';
import { IUserValueType } from './userValueType.interface';

type ExtractableItem = Record<string, unknown>;
type FieldValue = string | string[];
type StringArrayRecord = Record<string, string[]>;

export class ComplexLookupUserValueService implements IUserValueType {
  private readonly config = BASE_COMPLEX_LOOKUP_CONFIG;

  generate(value: UserValueDTO) {
    const { data, id, uuid, type } = value;

    return {
      uuid: uuid ?? '',
      contents: this.generateContents(data, id, type),
    };
  }

  private generateContents(data: unknown, id?: string, type?: string) {
    const dataArray = Array.isArray(data) ? data : [data];

    return dataArray.map(item => this.createContentItem(item, { defaultId: id, type }));
  }

  private createContentItem(item: unknown, { defaultId, type }: { defaultId?: string; type?: string }) {
    const contentItem: WithRequired<UserValueContents, 'meta'> = {
      id: this.getId(item, defaultId),
      label: this.getLabel(item),
      meta: {
        type,
        ...this.getAdditionalMeta(item),
      },
    };

    return contentItem;
  }

  private getId(item: unknown, defaultId?: string) {
    const extractedId = this.extractVocabLiteId(item);

    if (extractedId) return extractedId;

    // Handle configured ID fields - could be string or array
    const itemObj = this.asExtractableItem(item);

    if (!itemObj) return defaultId;

    const foundField = this.config.idFields.find(idField => itemObj[idField]);

    if (foundField) {
      const idValue = itemObj[foundField] as FieldValue;

      return this.getFirstStringValue(idValue);
    }

    return defaultId;
  }

  private getFirstNonEmptyArrayValue(obj: StringArrayRecord, fieldNames: string[]) {
    const foundField = fieldNames.find(fieldName => obj[fieldName] && this.isNonEmptyArray(obj[fieldName]));

    return foundField ? obj[foundField][0] : '';
  }

  private getLabel(item: unknown) {
    const extractedLabel = this.extractVocabLiteLabel(item);

    if (extractedLabel) return extractedLabel;

    // Handle nested value structures (like _name.value)
    const nestedInfo = this.extractNestedValueInfo(item);

    if (nestedInfo.label) return nestedInfo.label;

    // Fallback for other structures - check configured label fields
    if (this.isValidObject(item)) {
      const objItem = item as StringArrayRecord;

      return this.getFirstNonEmptyArrayValue(objItem, this.config.labelFallbacks);
    }

    return String(item);
  }

  private getAdditionalMeta(item: unknown) {
    const meta: Record<string, unknown> = {};
    const extractedUri = this.extractVocabLiteLink(item);

    if (extractedUri) {
      meta.uri = extractedUri;
    }

    // Add preferred meta for nested value structures
    const nestedInfo = this.extractNestedValueInfo(item);

    if (nestedInfo.preferred !== undefined) {
      meta[this.config.fieldPatterns.preferredProperty] = nestedInfo.preferred;
    }

    // Add any additional relation or type information found in the object
    this.extractAdditionalMeta(item, meta);

    return meta;
  }

  private extractVocabLiteValue(obj: unknown, propertyUri: string, visited = new WeakSet<object>()): string | null {
    const typedObj = this.asExtractableItem(obj);

    if (!typedObj) return null;

    if (visited.has(typedObj)) return null;

    visited.add(typedObj);

    // Check current level
    if (propertyUri in typedObj) {
      const value = typedObj[propertyUri];
      const firstValue = this.getFirstArrayValue(value);

      if (firstValue) return firstValue;
    }

    // Recursively search nested objects
    return Object.values(typedObj)
      .filter((value): value is object => this.isValidObject(value))
      .reduce<string | null>((result, value) => {
        if (result) return result;

        return this.extractVocabLiteValue(value, propertyUri, visited);
      }, null);
  }

  private extractVocabLiteLabel(obj: unknown) {
    return this.extractVocabLiteValue(obj, this.config.vocabLite.labelUri);
  }

  private extractVocabLiteLink(obj: unknown) {
    return this.extractVocabLiteValue(obj, this.config.vocabLite.linkUri);
  }

  private extractVocabLiteId(obj: unknown) {
    const link = this.extractVocabLiteLink(obj);

    return link ? link.split('/').pop() || null : null;
  }

  private extractAdditionalMeta(item: unknown, meta: Record<string, unknown>) {
    if (!item || typeof item !== 'object') return;

    const typedItem = item as Record<string, unknown>;

    this.config.relationFields.forEach(field => {
      if (field in typedItem && typeof typedItem[field] === 'string') {
        const cleanFieldName = field.replace(/^_/, '');

        meta[cleanFieldName] = typedItem[field];
      }
    });
  }

  private extractNestedValueInfo(item: unknown) {
    const typed = this.asExtractableItem(item);

    if (!typed) return {};

    const { nestedValueField, valueProperty, preferredProperty } = this.config.fieldPatterns;
    const nested = this.asExtractableItem(typed[nestedValueField]);

    if (!nested) return {};

    const valueArray = nested[valueProperty];
    const preferred = nested[preferredProperty] as boolean | undefined;
    const label = this.getFirstArrayValue(valueArray);

    return {
      ...(label && { label }),
      ...(preferred !== undefined && { preferred }),
    };
  }

  private isNonEmptyArray(value: unknown): value is unknown[] {
    return Array.isArray(value) && value.length > 0;
  }

  private isValidObject(value: unknown): value is ExtractableItem {
    return value !== null && typeof value === 'object';
  }

  private getFirstStringValue(value: FieldValue): string {
    return Array.isArray(value) ? value[0] : value;
  }

  private getFirstArrayValue(value: unknown): string | undefined {
    return this.isNonEmptyArray(value) ? String(value[0]) : undefined;
  }

  private asExtractableItem(value: unknown): ExtractableItem | null {
    return this.isValidObject(value) ? value : null;
  }
}
