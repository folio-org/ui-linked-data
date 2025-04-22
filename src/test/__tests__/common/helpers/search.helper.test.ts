import { removeBackslashes } from '@common/helpers/search.helper';

describe('search.helper', () => {
  describe('removeBackslashes', () => {
    it('removes all backslashes from a string', () => {
      const query = 'hello\\world\\test';
      const testResult = 'helloworldtest';

      expect(removeBackslashes(query)).toBe(testResult);
    });

    it('handles string with no backslashes', () => {
      const query = 'hello world test';

      expect(removeBackslashes(query)).toBe(query);
    });

    it('handles empty string', () => {
      expect(removeBackslashes('')).toBe('');
    });

    it('handles null query', () => {
      expect(removeBackslashes(null)).toBe('');
    });

    it('handles multiple consecutive backslashes', () => {
      const query = 'hello\\\\world';
      const testResult = 'helloworld';

      expect(removeBackslashes(query)).toBe(testResult);
    });

    it('preserves other special characters', () => {
      const query = 'hello\\world!@#$%^&*()';
      const testResult = 'helloworld!@#$%^&*()';

      expect(removeBackslashes(query)).toBe(testResult);
    });

    it('handles escaped quotes', () => {
      const query = 'hello\\"world\\"';
      const testResult = 'hello"world"';

      expect(removeBackslashes(query)).toBe(testResult);
    });

    it('handles escaped single quotes', () => {
      const query = "hello\\'world\\'";
      const testResult = "hello'world'";

      expect(removeBackslashes(query)).toBe(testResult);
    });

    it('handles escaped forward slashes', () => {
      const query = 'hello\\/world\\/test';
      const testResult = 'hello/world/test';

      expect(removeBackslashes(query)).toBe(testResult);
    });

    it('handles multiple escaped quotes in sequence', () => {
      const query = '\\"\\"\\"hello\\"\\"\\"';
      const testResult = '"""hello"""';

      expect(removeBackslashes(query)).toBe(testResult);
    });
  });
});
