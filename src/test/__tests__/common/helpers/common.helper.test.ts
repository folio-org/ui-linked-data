import { AdvancedFieldType, BaseFieldType } from '@common/constants/uiControls.constants';
import { alphabeticSortLabel, getAdvancedFieldType, getPropertyTemplateType } from '@common/helpers/common.helper';

describe('common.helper', () => {
  const propertyTemplate = {
    type: 'type',
    propertyURI: 'propertyURI',
    valueConstraint: {
      useValuesFrom: [],
      valueTemplateRefs: [],
    },
  } as unknown as PropertyTemplate;

  describe('alphabeticSortLabel', () => {
    const a = { label: 'a' };
    const b = { label: 'b' };

    test('returns -1 if a.label precedes b.label', () => {
      expect(alphabeticSortLabel(a, b)).toEqual(-1);
    });

    test('returns 1 if b.label precedes a.label', () => {
      expect(alphabeticSortLabel(b, a)).toEqual(1);
    });

    test('returns 0 if labels are equal', () => {
      expect(alphabeticSortLabel(a, a)).toEqual(0);
    });
  });

  describe('getPropertyTemplateType', () => {
    test("returns BaseFieldType.HIDE if propertyURI contains 'hasItem'", () => {
      expect(
        getPropertyTemplateType({
          ...propertyTemplate,
          propertyURI: 'http://id.loc.gov/ontologies/bibframe/hasItem',
        }),
      ).toEqual(BaseFieldType.HIDE);
    });

    test('returns BaseFieldType.UNKNOWN if no previous conditions were met and no useValuesFrom', () => {
      expect(getPropertyTemplateType(propertyTemplate)).toEqual(BaseFieldType.UNKNOWN);
    });
  });

  describe('getAdvancedFieldType', () => {
    test('returns AdvancedFieldType.profile for matching struct', () => {
      expect(
        getAdvancedFieldType({
          configType: AdvancedFieldType.profile,
        }),
      ).toEqual(AdvancedFieldType.profile);
    });

    test('returns AdvancedFieldType.block for matching struct', () => {
      expect(
        getAdvancedFieldType({
          propertyTemplates: [],
        }),
      ).toEqual(AdvancedFieldType.block);

      expect(
        getAdvancedFieldType({
          resourceURI: 'resourceURI',
        }),
      ).toEqual(AdvancedFieldType.block);
    });

    describe('calls to getPropertyTemplateType', () => {
      test('returns AdvancedFieldType.literal for matching struct', () => {
        expect(
          getAdvancedFieldType({
            ...propertyTemplate,
            type: AdvancedFieldType.literal,
          }),
        ).toEqual(AdvancedFieldType.literal);
      });

      test('returns AdvancedFieldType.simple for matching struct', () => {
        expect(
          getAdvancedFieldType({
            ...propertyTemplate,
            valueConstraint: {
              ...propertyTemplate.valueConstraint,
              useValuesFrom: ['useValuesFrom'],
            },
          }),
        ).toEqual(AdvancedFieldType.simple);
      });

      test('returns AdvancedFieldType.complex for matching struct', () => {
        expect(
          getAdvancedFieldType({
            ...propertyTemplate,
            valueConstraint: {
              ...propertyTemplate.valueConstraint,
              useValuesFrom: ['http://id.loc.gov/authorities/childrensSubjects'],
            },
          }),
        ).toEqual(AdvancedFieldType.complex);
      });

      test('returns AdvancedFieldType.group for matching struct', () => {
        expect(
          getAdvancedFieldType({
            ...propertyTemplate,
            propertyURI: 'http://id.loc.gov/ontologies/bibframe/hasInstance',
          }),
        ).toEqual(AdvancedFieldType.group);

        expect(
          getAdvancedFieldType({
            ...propertyTemplate,
            propertyURI: 'http://id.loc.gov/ontologies/bibframe/instanceOf',
          }),
        ).toEqual(AdvancedFieldType.group);
      });

      test('returns AdvancedFieldType.dropdown for matching struct', () => {
        expect(
          getAdvancedFieldType({
            ...propertyTemplate,
            valueConstraint: {
              valueTemplateRefs: [0, 1],
            },
          }),
        ).toEqual(AdvancedFieldType.dropdown);
      });

      test('returns AdvancedFieldType.groupComplex for matching struct', () => {
        expect(
          getAdvancedFieldType({
            ...propertyTemplate,
            valueConstraint: {
              valueTemplateRefs: ['valueTemplateRefs'],
            },
          }),
        ).toEqual(AdvancedFieldType.groupComplex);
      });
    });

    test('returns AdvancedFieldType.__fallback if no ruleset match found', () => {
      expect(getAdvancedFieldType({ randomField: 0 })).toEqual(AdvancedFieldType.__fallback);
    });
  });
});
