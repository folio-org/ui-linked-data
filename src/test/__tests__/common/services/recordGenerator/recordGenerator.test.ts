import { RecordGenerator } from '@common/services/recordGenerator';
import { RecordSchemaFactory } from '@common/services/recordGenerator/schemas';
import { ValueResult } from '@common/services/recordGenerator/types/value.types';

jest.mock('@common/services/recordGenerator/schemas/recordSchemaFactory');

describe('RecordGenerator', () => {
  let generator: RecordGenerator;
  let mockSchema: Schema;
  let mockUserValues: UserValues;
  let mockReferenceIds: { id: string }[];
  let mockRecordSchema: RecordSchema;

  beforeEach(() => {
    generator = new RecordGenerator();
    mockSchema = new Map();
    mockUserValues = {};
    mockReferenceIds = [{ id: 'test-reference-id' }];
    mockRecordSchema = {
      root: {
        options: {
          isRootEntry: true,
          references: [
            {
              outputField: 'refs',
            },
          ],
        },
      } as RecordSchemaEntry,
      field_1: {} as RecordSchemaEntry,
    };

    jest.spyOn(RecordSchemaFactory, 'getRecordSchema').mockReturnValue(mockRecordSchema);
  });

  describe('generate', () => {
    it('throws error when record schema is not found', () => {
      (RecordSchemaFactory.getRecordSchema as jest.Mock).mockReturnValue(null);

      expect(() => {
        generator.generate({
          schema: mockSchema,
          userValues: mockUserValues,
          referenceIds: mockReferenceIds,
        });
      }).toThrow('Record schema not found for profile type: monograph, entity type: work');
    });

    it('processes record schema correctly', () => {
      const profileSchemaManagerSpy = jest
        .spyOn(generator['profileSchemaManager'], 'findSchemaEntriesByUriBFLite')
        .mockReturnValue([{ id: 'test-entry' } as unknown as SchemaEntry]);

      const processSpy = jest
        .spyOn(generator['recordSchemaEntryManager'], 'processEntry')
        .mockReturnValueOnce({ value: { test_1: 'value 1' } } as unknown as ValueResult)
        .mockReturnValueOnce({ value: { test_2: 'value 2' } } as unknown as ValueResult);

      const result = generator.generate({
        schema: mockSchema,
        userValues: mockUserValues,
        referenceIds: mockReferenceIds,
      });

      expect(profileSchemaManagerSpy).toHaveBeenCalled();
      expect(processSpy).toHaveBeenCalled();
      expect(result).toEqual({
        resource: {
          root: {
            test_1: 'value 1',
            refs: [{ id: 'test-reference-id' }],
          },
          field_1: {
            test_2: 'value 2',
          },
        },
      });
    });

    it('initializes schema and process with custom profile and entity types', () => {
      const profileType = 'serial' as ProfileType;
      const entityType: ResourceType = 'instance';

      const profileSchemaManagerSpy = jest
        .spyOn(generator['profileSchemaManager'], 'findSchemaEntriesByUriBFLite')
        .mockReturnValue([{ id: 'test-entry' } as unknown as SchemaEntry]);

      const processSpy = jest
        .spyOn(generator['recordSchemaEntryManager'], 'processEntry')
        .mockReturnValue({ value: { test: 'value' } } as unknown as ValueResult);

      generator.generate(
        {
          schema: mockSchema,
          userValues: mockUserValues,
          referenceIds: mockReferenceIds,
        },
        profileType,
        entityType,
      );

      expect(RecordSchemaFactory.getRecordSchema).toHaveBeenCalledWith(profileType, entityType);
      expect(profileSchemaManagerSpy).toHaveBeenCalled();
      expect(processSpy).toHaveBeenCalled();
    });

    it('handles empty reference IDs', () => {
      jest
        .spyOn(generator['profileSchemaManager'], 'findSchemaEntriesByUriBFLite')
        .mockReturnValue([{ id: 'test-entry' } as unknown as SchemaEntry]);

      jest
        .spyOn(generator['recordSchemaEntryManager'], 'processEntry')
        .mockReturnValueOnce({ value: { test_1: 'value 1' } } as unknown as ValueResult)
        .mockReturnValueOnce({ value: { test_2: 'value 2' } } as unknown as ValueResult);

      const result = generator.generate({
        schema: mockSchema,
        userValues: mockUserValues,
      });

      expect(result).toEqual({
        resource: {
          root: {
            test_1: 'value 1',
          },
          field_1: {
            test_2: 'value 2',
          },
        },
      });
    });

    it('handles empty schema entries', () => {
      jest.spyOn(generator['profileSchemaManager'], 'findSchemaEntriesByUriBFLite').mockReturnValue([]);

      const result = generator.generate({
        schema: mockSchema,
        userValues: mockUserValues,
        referenceIds: mockReferenceIds,
      });

      expect(result).toEqual({
        resource: {},
      });
    });

    it('handles invalid processed values', () => {
      jest
        .spyOn(generator['profileSchemaManager'], 'findSchemaEntriesByUriBFLite')
        .mockReturnValue([{ id: 'test-entry' } as unknown as SchemaEntry]);

      jest
        .spyOn(generator['recordSchemaEntryManager'], 'processEntry')
        .mockReturnValue({ value: null } as unknown as ValueResult);

      const result = generator.generate({
        schema: mockSchema,
        userValues: mockUserValues,
        referenceIds: mockReferenceIds,
      });

      expect(result).toEqual({
        resource: {},
      });
    });

    it('finds root entry key from schema when not marked', () => {
      const mockSchemaWithoutRoot = {
        field_1: {} as RecordSchemaEntry,
      };
      jest.spyOn(RecordSchemaFactory, 'getRecordSchema').mockReturnValue(mockSchemaWithoutRoot);

      const profileSchemaManagerSpy = jest
        .spyOn(generator['profileSchemaManager'], 'findSchemaEntriesByUriBFLite')
        .mockReturnValue([{ id: 'test-entry' } as unknown as SchemaEntry]);

      const processSpy = jest
        .spyOn(generator['recordSchemaEntryManager'], 'processEntry')
        .mockReturnValue({ value: { test: 'value' } } as unknown as ValueResult);

      const result = generator.generate({
        schema: mockSchema,
        userValues: mockUserValues,
        referenceIds: mockReferenceIds,
      });

      expect(profileSchemaManagerSpy).toHaveBeenCalled();
      expect(processSpy).toHaveBeenCalled();
      expect(result).toEqual({
        resource: {
          field_1: {
            test: 'value',
          },
        },
      });
    });
  });
});
