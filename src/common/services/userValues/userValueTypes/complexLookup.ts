import { BASE_COMPLEX_LOOKUP_CONFIG } from './configs';
import { IUserValueType } from './userValueType.interface';

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
    return Array.isArray(data) ? this.handleArrayData(data, id, type) : this.handleSingleData(data, id, type);
  }

  private handleArrayData(data: unknown[], id?: string, type?: string) {
    return data.map(item => this.createContentItem(item, { defaultId: id, type }));
  }

  private handleSingleData(data: unknown, id?: string, type?: string) {
    return [this.createContentItem(data, { defaultId: id, type })];
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

    if (extractedId) {
      return extractedId;
    }

    // Handle configured ID fields - could be string or array
    const itemObj = item as Record<string, string | string[]>;

    for (const idField of this.config.idFields) {
      if (itemObj?.[idField]) {
        const idValue = itemObj[idField];

        return Array.isArray(idValue) ? idValue[0] : idValue;
      }
    }

    return defaultId;
  }

  private getLabel(item: unknown) {
    const extractedLabel = this.extractVocabLiteLabel(item);
    if (extractedLabel) {
      return extractedLabel;
    }

    // Handle nested value structures (like _name.value)
    const nestedInfo = this.extractNestedValueInfo(item);
    if (nestedInfo.label) return nestedInfo.label;

    // Fallback for other structures - check configured label fields
    if (typeof item === 'object' && item !== null) {
      const objItem = item as Record<string, string[]>;

      // Try each configured fallback field
      for (const fieldName of this.config.labelFallbacks) {
        if (objItem[fieldName] && Array.isArray(objItem[fieldName]) && objItem[fieldName].length > 0) {
          return objItem[fieldName][0];
        }
      }

      return '';
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
    if (!obj || typeof obj !== 'object') return null;

    const typedObj = obj as Record<string, unknown>;

    if (visited.has(typedObj)) return null; // prevent potential cycles

    visited.add(typedObj);

    if (propertyUri in typedObj) {
      const value = typedObj[propertyUri];

      if (Array.isArray(value) && value.length > 0) {
        return String(value[0]);
      }
    }

    for (const value of Object.values(typedObj)) {
      if (typeof value === 'object' && value !== null) {
        const result = this.extractVocabLiteValue(value, propertyUri, visited);

        if (result) return result;
      }
    }

    return null;
  }

  private extractVocabLiteLabel(obj: unknown) {
    return this.extractVocabLiteValue(obj, this.config.vocabLite.labelUri);
  }

  private extractVocabLiteLink(obj: unknown) {
    return this.extractVocabLiteValue(obj, this.config.vocabLite.linkUri);
  }

  private extractVocabLiteId(obj: unknown) {
    const link = this.extractVocabLiteLink(obj);

    if (link) {
      const linkParts = link.split('/');

      return linkParts[linkParts.length - 1];
    }

    return null;
  }

  private extractAdditionalMeta(item: unknown, meta: Record<string, unknown>) {
    if (!item || typeof item !== 'object') {
      return;
    }

    const typedItem = item as Record<string, unknown>;

    // Look for configured relation/type fields
    for (const field of this.config.relationFields) {
      if (field in typedItem && typeof typedItem[field] === 'string') {
        const cleanFieldName = field.replace(/^_/, '');

        meta[cleanFieldName] = typedItem[field];
      }
    }
  }

  private extractNestedValueInfo(item: unknown) {
    if (!item || typeof item !== 'object') return {};

    const { nestedValueField, valueProperty, preferredProperty } = this.config.fieldPatterns;
    const typed = item as Record<string, unknown>;

    if (!(nestedValueField in typed)) return {};

    const nested = typed[nestedValueField];

    if (!nested || typeof nested !== 'object') return {};

    const nestedObj = nested as Record<string, unknown>;
    const valueArray = nestedObj[valueProperty];
    const preferred = (nestedObj as Record<string, boolean>)[preferredProperty];

    let label: string | undefined;

    if (Array.isArray(valueArray) && valueArray.length > 0) {
      label = String(valueArray[0]);
    }

    return {
      ...(label ? { label } : {}),
      ...(preferred !== undefined ? { preferred } : {}),
    };
  }
}
