import { applyColumnFormatters, buildTableHeader } from './tableFormatters.util';

describe('tableFormatters.util', () => {
  describe('applyColumnFormatters', () => {
    let mockColumns: Record<string, SearchResultsTableColumn>;

    beforeEach(() => {
      mockColumns = {
        title: {
          label: 'ld.title',
          position: 0,
          className: 'title-column',
          formatter: jest.fn(({ row }) => row.title.label) as unknown as SearchResultsTableColumn['formatter'],
        },
        author: {
          label: 'ld.author',
          position: 1,
          className: 'author-column',
          formatter: jest.fn(({ row }) => row.author?.label) as unknown as SearchResultsTableColumn['formatter'],
        },
        description: {
          label: 'ld.description',
          position: 2,
          className: 'description-column',
        },
      };
    });

    const mockRows: SearchResultsTableRow[] = [
      {
        __meta: { id: 'id_1', key: 'key_1' },
        title: { label: 'Title 1' },
        author: { label: 'Author 1' },
        description: { label: 'Description 1' },
      },
      {
        __meta: { id: 'id_2', key: 'key_2' },
        title: { label: 'Title 2' },
        author: { label: 'Author 2' },
        description: { label: 'Description 2' },
      },
    ];

    const mockContext = {
      formatMessage: jest.fn(),
      onEdit: jest.fn(),
    };

    it('applies formatters to each row', () => {
      const result = applyColumnFormatters(mockRows, mockColumns, mockContext);

      expect(result).toHaveLength(2);
      expect(mockColumns.title.formatter as jest.Mock).toHaveBeenCalled();
      expect(mockColumns.author.formatter as jest.Mock).toHaveBeenCalled();
    });

    it('calls formatter with row and context', () => {
      const formatterSpy = jest.fn(({ row }) => row.title.label);
      const columns = {
        title: {
          label: 'ld.title',
          position: 0,
          formatter: formatterSpy,
        },
      };

      applyColumnFormatters(mockRows, columns, mockContext);

      expect(formatterSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          row: mockRows[0],
          ...mockContext,
        }),
      );
    });

    it('uses base cell label when no formatter is provided', () => {
      const result = applyColumnFormatters(mockRows, mockColumns, mockContext);

      expect(result[0].description.children).toBe('Description 1');
      expect(result[1].description.children).toBe('Description 2');
    });

    it('preserves __meta property in formatted rows', () => {
      const result = applyColumnFormatters(mockRows, mockColumns, mockContext);

      expect(result[0].__meta).toEqual({ id: 'id_1', key: 'key_1' });
      expect(result[1].__meta).toEqual({ id: 'id_2', key: 'key_2' });
    });

    it('handles empty rows array', () => {
      const result = applyColumnFormatters([], mockColumns, mockContext);

      expect(result).toEqual([]);
    });

    it('handles rows with missing cell data', () => {
      const rowsWithMissingData: SearchResultsTableRow[] = [
        {
          __meta: { id: 'id_3', key: 'key_3' },
          title: { label: 'Title 3' },
        },
      ];

      const result = applyColumnFormatters(rowsWithMissingData, mockColumns, mockContext);

      expect(result[0].author.children).toBeUndefined();
      expect(result[0].description.children).toBeUndefined();
    });

    it('passes all context properties to formatter', () => {
      const formatterSpy = jest.fn();
      const columns = {
        action: {
          label: 'ld.action',
          position: 0,
          formatter: formatterSpy,
        },
      };
      const context = {
        onEdit: jest.fn(),
        onDelete: jest.fn(),
        formatMessage: jest.fn(),
      };

      applyColumnFormatters(mockRows, columns, context);

      expect(formatterSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          onEdit: context.onEdit,
          onDelete: context.onDelete,
          formatMessage: context.formatMessage,
        }),
      );
    });

    it('preserves base cell properties', () => {
      const rowsWithProps: SearchResultsTableRow[] = [
        {
          __meta: { id: 'id_4', key: 'key_4' },
          title: {
            label: 'Title 4',
            className: 'custom-class',
            position: 5,
          },
        },
      ];

      const result = applyColumnFormatters(rowsWithProps, mockColumns, mockContext);

      expect(result[0].title.className).toBe('custom-class');
      expect(result[0].title.position).toBe(5);
    });
  });

  describe('buildTableHeader', () => {
    let mockFormatMessage: jest.Mock;

    beforeEach(() => {
      mockFormatMessage = jest.fn(({ id }) => `formatted.${id}`);
    });

    const mockColumns: Record<string, SearchResultsTableColumn> = {
      title: {
        label: 'ld.title',
        position: 0,
        className: 'title-column',
        minWidth: 200,
        maxWidth: 500,
      },
      author: {
        label: 'ld.author',
        position: 1,
        className: 'author-column',
        minWidth: 150,
      },
      source: {
        label: 'ld.source',
        position: 2,
        className: 'source-column',
      },
    };

    it('builds header with formatted labels', () => {
      const result = buildTableHeader(mockColumns, mockFormatMessage);

      expect(result.title.label).toBe('formatted.ld.title');
      expect(result.author.label).toBe('formatted.ld.author');
      expect(result.source.label).toBe('formatted.ld.source');
    });

    it('calls formatMessage for each column label', () => {
      buildTableHeader(mockColumns, mockFormatMessage);

      expect(mockFormatMessage).toHaveBeenCalledWith({ id: 'ld.title' });
      expect(mockFormatMessage).toHaveBeenCalledWith({ id: 'ld.author' });
      expect(mockFormatMessage).toHaveBeenCalledWith({ id: 'ld.source' });
    });

    it('includes position in header cells', () => {
      const result = buildTableHeader(mockColumns, mockFormatMessage);

      expect(result.title.position).toBe(0);
      expect(result.author.position).toBe(1);
      expect(result.source.position).toBe(2);
    });

    it('includes className in header cells', () => {
      const result = buildTableHeader(mockColumns, mockFormatMessage);

      expect(result.title.className).toBe('title-column');
      expect(result.author.className).toBe('author-column');
      expect(result.source.className).toBe('source-column');
    });

    it('includes minWidth when provided', () => {
      const result = buildTableHeader(mockColumns, mockFormatMessage);

      expect(result.title.minWidth).toBe(200);
      expect(result.author.minWidth).toBe(150);
      expect(result.source.minWidth).toBeUndefined();
    });

    it('includes maxWidth when provided', () => {
      const result = buildTableHeader(mockColumns, mockFormatMessage);

      expect(result.title.maxWidth).toBe(500);
      expect(result.author.maxWidth).toBeUndefined();
      expect(result.source.maxWidth).toBeUndefined();
    });

    it('handles columns without label', () => {
      const columnsWithoutLabel: Record<string, SearchResultsTableColumn> = {
        action: {
          label: '',
          position: 0,
          className: 'action-column',
        },
      };

      const result = buildTableHeader(columnsWithoutLabel, mockFormatMessage);

      expect(result.action.label).toBe('');
    });

    it('handles empty columns object', () => {
      const result = buildTableHeader({}, mockFormatMessage);

      expect(result).toEqual({});
    });

    it('creates header with all column keys', () => {
      const result = buildTableHeader(mockColumns, mockFormatMessage);

      expect(Object.keys(result)).toEqual(['title', 'author', 'source']);
    });

    it('handles columns with special characters in labels', () => {
      const specialColumns: Record<string, SearchResultsTableColumn> = {
        description: {
          label: 'ld.special.label.with.dots',
          position: 0,
        },
      };

      const result = buildTableHeader(specialColumns, mockFormatMessage);

      expect(mockFormatMessage).toHaveBeenCalledWith({ id: 'ld.special.label.with.dots' });
      expect(result.description.label).toBe('formatted.ld.special.label.with.dots');
    });
  });
});
