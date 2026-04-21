import { ValueProcessor } from '@/common/services/recordGenerator/processors/value/valueProcessor';
import { UserValueContents } from '@/common/services/recordGenerator/processors/value/valueProcessor.interface';
import { ValueOptions } from '@/common/services/recordGenerator/types/value.types';

describe('ValueProcessor', () => {
  let processor: ValueProcessor;

  beforeEach(() => {
    processor = new ValueProcessor();
  });

  describe('processSimpleValues', () => {
    it('extracts labels from values array', () => {
      const values: UserValueContents[] = [{ label: 'Label 1' }, { label: 'Label 2' }];

      const result = processor.processSimpleValues(values);

      expect(result).toEqual(['Label 1', 'Label 2']);
    });

    it('returns null for empty input', () => {
      const values: UserValueContents[] = [];

      const result = processor.processSimpleValues(values);

      expect(result).toBeNull();
    });

    it('prefers meta.basicLabel over label', () => {
      const values: UserValueContents[] = [
        { label: 'Label 1', meta: { basicLabel: 'Basic Label 1' } },
        { label: 'Label 2' },
      ];

      const result = processor.processSimpleValues(values);

      expect(result).toEqual(['Basic Label 1', 'Label 2']);
    });

    it('filters out undefined labels', () => {
      const values: UserValueContents[] = [{ label: 'Label 1' }, { label: undefined }, { label: 'Label 3' }];

      const result = processor.processSimpleValues(values);

      expect(result).toEqual(['Label 1', 'Label 3']);
    });

    it('filters out empty string labels', () => {
      const values: UserValueContents[] = [{ label: 'Label 1' }, { label: '' }, { label: 'Label 3' }];

      const result = processor.processSimpleValues(values);

      expect(result).toEqual(['Label 1', 'Label 3']);
    });

    it('returns null when all values are filtered out', () => {
      const values: UserValueContents[] = [{ label: '' }, { label: undefined }];

      const result = processor.processSimpleValues(values);

      expect(result).toBeNull();
    });
  });

  describe('process', () => {
    it('processes values with default options', () => {
      const values: UserValueContents[] = [{ label: 'Label 1' }, { label: 'Label 2' }];

      const result = processor.process(values);

      expect(result).toEqual({
        value: ['Label 1', 'Label 2'],
        options: {},
      });
    });

    it('processes values with custom options', () => {
      const values: UserValueContents[] = [{ label: 'Label 1' }, { label: 'Label 2' }];
      const options: ValueOptions = {
        hiddenWrapper: true,
        isReference: false,
      };

      const result = processor.process(values, options);

      expect(result).toEqual({
        value: ['Label 1', 'Label 2'],
        options,
      });
    });

    it('handles empty values array', () => {
      const values: UserValueContents[] = [];
      const options: ValueOptions = {
        hiddenWrapper: true,
      };

      const result = processor.process(values, options);

      expect(result).toEqual({
        value: null,
        options,
      });
    });
  });

  describe('processSchemaValues', () => {
    it('returns original processor value when not empty', () => {
      const processorValue = {
        property_1: 'value 1',
        property_2: 'value 2',
      };
      const options: ValueOptions = {
        isReference: true,
      };

      const result = processor.processSchemaValues(processorValue, options);

      expect(result).toEqual({
        value: processorValue,
        options,
      });
    });

    it('returns null value for empty processor value', () => {
      const processorValue = {};
      const options: ValueOptions = {
        isReference: true,
      };

      const result = processor.processSchemaValues(processorValue, options);

      expect(result).toEqual({
        value: null,
        options,
      });
    });

    it('processes with default options when none provided', () => {
      const processorValue = {
        property_1: 'value 1',
      };

      const result = processor.processSchemaValues(processorValue);

      expect(result).toEqual({
        value: processorValue,
        options: {},
      });
    });
  });
});
