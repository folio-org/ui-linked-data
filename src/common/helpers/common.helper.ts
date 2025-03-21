import { BF2_PROPERTY_URIS } from '@common/constants/bibframe.constants';
import { lookupConfig } from '@common/constants/lookup.constants';
import { BaseFieldType, AdvancedFieldType } from '@common/constants/uiControls.constants';

export const alphabeticSortLabel = <T extends { label?: string }>(a: T, b: T): 0 | -1 | 1 => {
  const aLabel = a.label?.toLocaleLowerCase();
  const bLabel = b.label?.toLocaleLowerCase();

  if (!aLabel || (!!bLabel && bLabel > aLabel)) return -1;
  if (!bLabel || aLabel > bLabel) return 1;

  return 0;
};

export const getPropertyTemplateType = ({
  type,
  propertyURI,
  valueConstraint: { valueTemplateRefs, useValuesFrom },
}: PropertyTemplate): FieldType => {
  // these meta componets are structural things, like add new instances/items. etc
  if (
    propertyURI === BF2_PROPERTY_URIS.HAS_INSTANCE ||
    propertyURI === BF2_PROPERTY_URIS.INSTANCE_OF
  )
    return BaseFieldType.META;

  // we handle this structural thing elsewhere
  if (propertyURI === BF2_PROPERTY_URIS.HAS_ITEM) return BaseFieldType.HIDE;

  if (valueTemplateRefs.length > 0) return BaseFieldType.REF;

  if (type === AdvancedFieldType.literal) return BaseFieldType.LITERAL;

  if (useValuesFrom.length === 0) return BaseFieldType.UNKNOWN;

  let localType: FieldType = BaseFieldType.SIMPLE;

  useValuesFrom.forEach(uri => {
    if (lookupConfig[uri]?.type.toLowerCase() === AdvancedFieldType.complex) {
      localType = BaseFieldType.COMPLEX;
    }
  });

  return localType;
};

export const getAdvancedFieldType = (struct: Record<string, unknown>): AdvancedFieldType => {
  // ProfileEntry
  if (struct?.configType === AdvancedFieldType.profile) return AdvancedFieldType.profile;

  // ResourceTemplate
  if (struct?.propertyTemplates || struct?.resourceURI) return AdvancedFieldType.block;

  // PropertyTemplate (& its subtypes)
  if (struct?.propertyLabel || struct?.propertyURI) {
    const baseType = getPropertyTemplateType(struct as PropertyTemplate);

    switch (baseType) {
      case BaseFieldType.LITERAL:
        return AdvancedFieldType.literal;
      case BaseFieldType.SIMPLE:
        return AdvancedFieldType.simple;
      case BaseFieldType.COMPLEX:
        return AdvancedFieldType.complex;
      case BaseFieldType.HIDE:
      case BaseFieldType.META:
        return AdvancedFieldType.group;
      case BaseFieldType.REF: {
        const {
          valueConstraint: { valueTemplateRefs },
        } = struct as PropertyTemplate;

        return valueTemplateRefs.length > 1 ? AdvancedFieldType.dropdown : AdvancedFieldType.groupComplex;
      }
      default:
        return AdvancedFieldType.__fallback;
    }
  }

  return AdvancedFieldType.__fallback;
};

export const deleteFromSetImmutable = <T = unknown>(set: Set<T>, toDelete: T[]) => {
  const clone = new Set([...set]);

  toDelete.forEach(entry => clone.delete(entry));

  return clone;
};
