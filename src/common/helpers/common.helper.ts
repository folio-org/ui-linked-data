import { lookupConfig } from '../../constants';
import { BaseFieldType, AdvancedFieldType } from '../constants/uiControls.constants';

export const aplhabeticSortLabel = <T extends { label: string }>(a: T, b: T): 0 | -1 | 1 => {
  if (a.label < b.label) return -1;
  if (a.label > b.label) return 1;

  return 0;
};

export const getPropertyTemplateType = ({
  type,
  propertyURI,
  valueConstraint: { valueTemplateRefs, useValuesFrom },
}: PropertyTemplate): FieldType => {
  // these meta componets are structural things, like add new instances/items. etc
  if (
    propertyURI === 'http://id.loc.gov/ontologies/bibframe/hasInstance' ||
    propertyURI === 'http://id.loc.gov/ontologies/bibframe/instanceOf'
  )
    return BaseFieldType.META;

  // we handle this structural thing elsewhere
  // TODO: ^ no idea what this means
  if (propertyURI === 'http://id.loc.gov/ontologies/bibframe/hasItem') return BaseFieldType.HIDE;

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

// TODO: potentially clean up
export const getAdvancedFieldType = (struct: Record<string, any>): AdvancedFieldType => {
  // ProfileEntry
  if (struct?.configType === AdvancedFieldType.profile) return AdvancedFieldType.profile;

  // ResourceTemplate
  if (struct?.propertyTemplates || struct?.resourceURI) return AdvancedFieldType.block;

  // PropertyTemplate (& its subtypes)
  if (struct?.propertyLabel || struct?.propertyURI) {
    const baseType = getPropertyTemplateType(struct as PropertyTemplate);

    if (baseType === BaseFieldType.LITERAL) return AdvancedFieldType.literal;
    
    if (baseType === BaseFieldType.SIMPLE) return AdvancedFieldType.simple;

    if (baseType === BaseFieldType.COMPLEX) return AdvancedFieldType.complex; // TODO: define required fields and values for Complex field

    // TODO: clarify
    if (baseType === BaseFieldType.HIDE || baseType === BaseFieldType.META) return AdvancedFieldType.group;

    if (baseType === BaseFieldType.REF) {
      const {
        valueConstraint: { valueTemplateRefs },
      } = struct as PropertyTemplate;

      if (valueTemplateRefs.length <= 0) return AdvancedFieldType.__fallback; // TODO -- what type ?

      if (valueTemplateRefs.length > 1) return AdvancedFieldType.dropdown;

      return AdvancedFieldType.groupComplex;
    }

    // TODO: REF -> META. HIDE
    // in old handled by index = 0 & setAsGroup
  }

  return AdvancedFieldType.__fallback;
};
