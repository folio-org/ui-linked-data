import { act } from '@testing-library/react';
import { v4 as uuidv4 } from 'uuid';

import { SchemaWithDuplicatesService } from '@/common/services/schema';
import { SelectedEntriesService } from '@/common/services/selectedEntries';
import { ISelectedEntries } from '@/common/services/selectedEntries/selectedEntries.interface';
import { IUserValues } from '@/common/services/userValues/userValues.interface';

jest.mock('uuid');

describe('SchemaWithDuplicatesService', () => {
  const schema = new Map([
    ['testKey-0', { path: ['testKey-0'], uuid: 'testKey-0', children: ['testKey-1', 'testKey-2'] }],
    ['testKey-1', { path: ['testKey-0', 'testKey-1'], uuid: 'testKey-1', children: ['testKey-3'] }],
    ['testKey-2', { path: ['testKey-0', 'testKey-2'], uuid: 'testKey-2', children: ['testKey-4'] }],
    ['testKey-3', { path: ['testKey-0', 'testKey-1', 'testKey-3'], uuid: 'testKey-3', children: [] }],
    ['testKey-4', { path: ['testKey-0', 'testKey-2', 'testKey-4'], uuid: 'testKey-4', children: ['testKey-5'] }],
    [
      'testKey-5',
      { path: ['testKey-0', 'testKey-2', 'testKey-4', 'testKey-5'], uuid: 'testKey-5', children: ['testKey-6'] },
    ],
    [
      'testKey-6',
      { path: ['testKey-0', 'testKey-2', 'testKey-4', 'testKey-5', 'testKey-6'], uuid: 'testKey-6', children: [] },
    ],
  ]);
  const selectedEntries = ['testKey-1'];

  let schemaWithDuplicatesService: SchemaWithDuplicatesService;

  const initServices = (altSchema: Schema = schema) => {
    const selectedEntriesService = new SelectedEntriesService(selectedEntries);
    schemaWithDuplicatesService = new SchemaWithDuplicatesService(altSchema, selectedEntriesService);
  };

  describe('duplicateEntry', () => {
    beforeEach(initServices);

    const constraints = { repeatable: true } as Constraints;
    const entry = {
      path: ['testKey-0', 'testKey-2', 'testKey-4'],
      uuid: 'testKey-4',
      uriBFLite: 'mockUri',
      children: ['testKey-5'],
      constraints,
    };

    test('adds a copied entry', async () => {
      (uuidv4 as jest.Mock)
        .mockReturnValueOnce('testKey-7')
        .mockReturnValueOnce('testKey-8')
        .mockReturnValueOnce('testKey-9')
        .mockReturnValueOnce('testKey-10');

      const entryData = { ...entry, constraints };
      const testResult = new Map([
        ['testKey-0', { path: ['testKey-0'], uuid: 'testKey-0', children: ['testKey-1', 'testKey-2'] }],
        ['testKey-1', { path: ['testKey-0', 'testKey-1'], uuid: 'testKey-1', children: ['testKey-3'] }],
        [
          'testKey-2',
          {
            path: ['testKey-0', 'testKey-2'],
            uuid: 'testKey-2',
            children: ['testKey-4', 'testKey-7'],
            twinChildren: { mockUri: ['testKey-4', 'testKey-7'] },
          },
        ],
        ['testKey-3', { path: ['testKey-0', 'testKey-1', 'testKey-3'], uuid: 'testKey-3', children: [] }],
        [
          'testKey-4',
          {
            path: ['testKey-0', 'testKey-2', 'testKey-4'],
            uuid: 'testKey-4',
            cloneIndex: 0,
            children: ['testKey-5'],
            deletable: true,
          },
        ],
        [
          'testKey-5',
          { path: ['testKey-0', 'testKey-2', 'testKey-4', 'testKey-5'], uuid: 'testKey-5', children: ['testKey-6'] },
        ],
        [
          'testKey-6',
          { path: ['testKey-0', 'testKey-2', 'testKey-4', 'testKey-5', 'testKey-6'], uuid: 'testKey-6', children: [] },
        ],
        [
          'testKey-7',
          {
            path: ['testKey-0', 'testKey-2', 'testKey-7'],
            uuid: 'testKey-7',
            uriBFLite: 'mockUri',
            cloneIndex: 1,
            children: ['testKey-8'],
            deletable: true,
            constraints,
          },
        ],
        [
          'testKey-8',
          {
            path: ['testKey-0', 'testKey-2', 'testKey-7', 'testKey-8'],
            uuid: 'testKey-8',
            children: ['testKey-9'],
          },
        ],
        [
          'testKey-9',
          {
            path: ['testKey-0', 'testKey-2', 'testKey-7', 'testKey-8', 'testKey-9'],
            uuid: 'testKey-9',
            children: [],
          },
        ],
      ]);

      await act(async () => await schemaWithDuplicatesService.duplicateEntry(entryData));

      expect(schemaWithDuplicatesService.get()).toEqual(testResult);
    });

    test('does not add a new entry', async () => {
      const constraints = { repeatable: false } as Constraints;
      const entryData = { ...entry, constraints };

      await act(async () => await schemaWithDuplicatesService.duplicateEntry(entryData));

      expect(schemaWithDuplicatesService.get()).toEqual(schema);
    });
  });

  describe('deleteEntry', () => {
    const entry = {
      uriBFLite: 'mockUri',
      path: ['testKey-0', 'testKey-2', 'testKey-4', 'testKey-6'],
      uuid: 'testKey-6',
      children: ['nonExistent', 'testKey-7'],
      deletable: true,
    };

    const getSchema = (altEntry: SchemaEntry = entry, otherEntries: [string, SchemaEntry][] = []) =>
      new Map([
        ['testKey-0', { path: ['testKey-0'], uuid: 'testKey-0', children: ['testKey-1', 'testKey-2'] }],
        ['testKey-1', { path: ['testKey-0', 'testKey-1'], uuid: 'testKey-1', children: ['testKey-3'] }],
        ['testKey-2', { path: ['testKey-0', 'testKey-2'], uuid: 'testKey-2', children: ['testKey-4'] }],
        ['testKey-3', { path: ['testKey-0', 'testKey-1', 'testKey-3'], uuid: 'testKey-3', children: [] }],
        [
          'testKey-4',
          {
            path: ['testKey-0', 'testKey-2', 'testKey-4'],
            uuid: 'testKey-4',
            children: ['testKey-5', altEntry.uuid],
            twinChildren: { mockUri: ['testKey-5', altEntry.uuid] },
          },
        ],
        [
          'testKey-5',
          {
            uriBFLite: 'mockUri',
            path: ['testKey-0', 'testKey-2', 'testKey-4', 'testKey-5'],
            uuid: 'testKey-5',
            children: [],
            deletable: true,
          },
        ],
        ['testKey-6', altEntry],
        ...otherEntries,
      ]);

    test('deletes an entry', () => {
      initServices(
        getSchema(entry, [
          [
            'testKey-7',
            {
              path: ['testKey-0', 'testKey-2', 'testKey-4', 'testKey-6', 'testKey-7'],
              uuid: 'testKey-7',
              children: [],
            },
          ],
        ]),
      );

      const testResult = new Map([
        ['testKey-0', { path: ['testKey-0'], uuid: 'testKey-0', children: ['testKey-1', 'testKey-2'] }],
        ['testKey-1', { path: ['testKey-0', 'testKey-1'], uuid: 'testKey-1', children: ['testKey-3'] }],
        ['testKey-2', { path: ['testKey-0', 'testKey-2'], uuid: 'testKey-2', children: ['testKey-4'] }],
        ['testKey-3', { path: ['testKey-0', 'testKey-1', 'testKey-3'], uuid: 'testKey-3', children: [] }],
        [
          'testKey-4',
          {
            path: ['testKey-0', 'testKey-2', 'testKey-4'],
            uuid: 'testKey-4',
            children: ['testKey-5'],
            twinChildren: { mockUri: ['testKey-5'] },
          },
        ],
        [
          'testKey-5',
          {
            uriBFLite: 'mockUri',
            path: ['testKey-0', 'testKey-2', 'testKey-4', 'testKey-5'],
            uuid: 'testKey-5',
            children: [],
            deletable: false,
          },
        ],
        [
          'testKey-5',
          {
            uriBFLite: 'mockUri',
            path: ['testKey-0', 'testKey-2', 'testKey-4', 'testKey-5'],
            uuid: 'testKey-5',
            children: [],
            cloneIndex: 0,
            deletable: false,
          },
        ],
      ]);

      schemaWithDuplicatesService.deleteEntry(entry);

      expect(schemaWithDuplicatesService.get()).toEqual(testResult);
    });

    test("doesn't delete an entry if it lack deletable property", () => {
      const nonDeletableEntry = { ...entry, deletable: false };
      const schema = getSchema(nonDeletableEntry);

      initServices(schema);

      schemaWithDuplicatesService.deleteEntry(nonDeletableEntry);

      expect(schemaWithDuplicatesService.get()).toEqual(schema);
    });

    test('updates parent twinChildren when duplicating entry with children', async () => {
      (uuidv4 as jest.Mock).mockReturnValueOnce('testKey-7').mockReturnValueOnce('testKey-8');

      const parentEntry = {
        uuid: 'testKey-1',
        path: ['testKey-1'],
        children: ['testKey-2'],
        twinChildren: {
          mockUri: ['testKey-2'],
        },
      };

      const childEntry = {
        uriBFLite: 'mockUri',
        uuid: 'testKey-2',
        path: ['testKey-1', 'testKey-2'],
        children: ['testKey-3'],
        constraints: { repeatable: true },
      };

      const grandChildEntry = {
        uuid: 'testKey-3',
        path: ['testKey-1', 'testKey-2', 'testKey-3'],
        children: [],
      };

      const testSchema = new Map([
        ['testKey-1', parentEntry as SchemaEntry],
        ['testKey-2', childEntry as SchemaEntry],
        ['testKey-3', grandChildEntry],
      ]);

      initServices(testSchema);

      await act(async () => await schemaWithDuplicatesService.duplicateEntry(childEntry as SchemaEntry));

      const updatedParent = schemaWithDuplicatesService.get().get('testKey-1');
      expect(updatedParent?.twinChildren?.['mockUri']).toEqual(['testKey-2', 'testKey-7']);
      expect(updatedParent?.children).toEqual(['testKey-2', 'testKey-7']);
    });

    test('updates parent twinChildren when deleting entry', () => {
      const parentEntry = {
        uuid: 'testKey-1',
        path: ['testKey-1'],
        children: ['testKey-2', 'testKey-3'],
        twinChildren: {
          mockUri: ['testKey-2', 'testKey-3'],
        },
      };

      const childEntry = {
        uriBFLite: 'mockUri',
        uuid: 'testKey-2',
        path: ['testKey-1', 'testKey-2'],
        deletable: true,
      };

      const testSchema = new Map([
        ['testKey-1', parentEntry],
        ['testKey-2', { ...childEntry, children: [], twinChildren: { mockUri: [] } }],
        ['testKey-3', { ...childEntry, uuid: 'testKey-3', children: [], twinChildren: { mockUri: [] } }],
      ]);

      initServices(testSchema);

      schemaWithDuplicatesService.deleteEntry(childEntry);

      const updatedParent = schemaWithDuplicatesService.get().get('testKey-1');
      expect(updatedParent?.twinChildren?.['mockUri']).toEqual(['testKey-3']);
      expect(updatedParent?.children).toEqual(['testKey-3']);
    });
  });

  describe('duplicateEntry with auto-duplication', () => {
    const initialSchema = new Map([
      [
        'parent',
        {
          uuid: 'parent',
          path: ['parent'],
          uriBFLite: 'parent-uri',
          children: ['child-1', 'child-2'],
          constraints: { repeatable: true },
          twinChildren: {
            'child-uri': ['child-1', 'child-2'],
          },
        },
      ],
      [
        'child-1',
        {
          uuid: 'child-1',
          path: ['parent', 'child-1'],
          uriBFLite: 'child-uri',
          cloneIndex: 0,
          children: [],
        },
      ],
      [
        'child-2',
        {
          uuid: 'child-2',
          path: ['parent', 'child-2'],
          uriBFLite: 'child-uri',
          cloneIndex: 1,
          children: [],
        },
      ],
    ]) as Schema;

    let selectedEntriesService: ISelectedEntries;

    beforeEach(() => {
      (uuidv4 as jest.Mock)
        .mockReturnValueOnce('new-parent')
        .mockReturnValueOnce('new-child-1')
        .mockReturnValueOnce('new-child-2');

      selectedEntriesService = new SelectedEntriesService([]);
      schemaWithDuplicatesService = new SchemaWithDuplicatesService(initialSchema, selectedEntriesService);
    });

    test('skips auto-duplicated entries when duplicating with isAutoDuplication flag', async () => {
      await act(
        async () => await schemaWithDuplicatesService.duplicateEntry(initialSchema.get('parent') as SchemaEntry, true),
      );

      const resultSchema = schemaWithDuplicatesService.get();

      // Check that new parent entry was created
      expect(resultSchema.get('new-parent')).toBeTruthy();

      // Check that only the first child was duplicated (non auto-duplicated entry)
      expect(resultSchema.get('new-parent')?.children).toHaveLength(1);
      expect(resultSchema.get('new-parent')?.children).toContain('new-child-1');

      // Check that twin children were updated correctly
      expect(resultSchema.get('new-parent')?.twinChildren?.['child-uri']).toHaveLength(1);
      expect(resultSchema.get('new-parent')?.twinChildren?.['child-uri']).toContain('new-child-1');
    });

    test('preserves all entries when duplicating without isAutoDuplication flag', async () => {
      await act(
        async () => await schemaWithDuplicatesService.duplicateEntry(initialSchema.get('parent') as SchemaEntry, false),
      );

      const resultSchema = schemaWithDuplicatesService.get();

      // Check that new parent entry was created
      expect(resultSchema.get('new-parent')).toBeTruthy();

      // Check that both children were duplicated
      expect(resultSchema.get('new-parent')?.children).toHaveLength(2);
      expect(resultSchema.get('new-parent')?.children).toContain('new-child-1');
      expect(resultSchema.get('new-parent')?.children).toContain('new-child-2');

      // Check that twin children were preserved
      expect(resultSchema.get('new-parent')?.twinChildren?.['child-uri']).toHaveLength(2);
      expect(resultSchema.get('new-parent')?.twinChildren?.['child-uri']).toContain('new-child-1');
      expect(resultSchema.get('new-parent')?.twinChildren?.['child-uri']).toContain('new-child-2');
    });
  });

  describe('duplicateEntry with enumerated fields and user values', () => {
    let mockUserValuesService: IUserValues;
    let selectedEntriesService: ISelectedEntries;

    beforeEach(() => {
      mockUserValuesService = {
        getValue: jest.fn(),
        setValue: jest.fn(),
        getAllValues: jest.fn(),
        set: jest.fn(),
      } as IUserValues;

      selectedEntriesService = new SelectedEntriesService([]);
    });

    test('duplicates user values for enumerated field with dropdownOption children', async () => {
      const enumeratedSchema = new Map([
        [
          'enumerated-parent',
          {
            uuid: 'enumerated-parent',
            path: ['enumerated-parent'],
            uriBFLite: 'enumerated-uri',
            type: 'enumerated',
            children: ['dropdown-option-1'],
            constraints: { repeatable: true },
          },
        ],
        [
          'dropdown-option-1',
          {
            uuid: 'dropdown-option-1',
            path: ['enumerated-parent', 'dropdown-option-1'],
            uriBFLite: 'dropdown-option-uri',
            type: 'dropdownOption',
            children: [],
          },
        ],
      ]) as Schema;

      const originalUserValue = {
        uuid: 'enumerated-parent',
        contents: [
          {
            label: 'Option Label',
            meta: {
              uri: 'http://example.com/option1',
              type: 'enumerated',
              basicLabel: 'Option Label',
            },
          },
        ],
      };

      (mockUserValuesService.getValue as jest.Mock).mockReturnValue(originalUserValue);

      (uuidv4 as jest.Mock).mockReturnValueOnce('new-enumerated').mockReturnValueOnce('new-dropdown');

      schemaWithDuplicatesService = new SchemaWithDuplicatesService(
        enumeratedSchema,
        selectedEntriesService,
        undefined,
        mockUserValuesService,
      );

      await act(
        async () =>
          await schemaWithDuplicatesService.duplicateEntry(enumeratedSchema.get('enumerated-parent') as SchemaEntry),
      );

      expect(mockUserValuesService.getValue).toHaveBeenCalledWith('enumerated-parent');
      expect(mockUserValuesService.setValue).toHaveBeenCalledWith({
        type: 'enumerated',
        key: 'new-enumerated',
        value: {
          data: 'http://example.com/option1',
        },
      });
    });

    test('duplicates user values with multiple URIs for enumerated field', async () => {
      const enumeratedSchema = new Map([
        [
          'enumerated-parent',
          {
            uuid: 'enumerated-parent',
            path: ['enumerated-parent'],
            uriBFLite: 'enumerated-uri',
            type: 'enumerated',
            children: ['dropdown-option-1'],
            constraints: { repeatable: true },
          },
        ],
        [
          'dropdown-option-1',
          {
            uuid: 'dropdown-option-1',
            path: ['enumerated-parent', 'dropdown-option-1'],
            uriBFLite: 'dropdown-option-uri',
            type: 'dropdownOption',
            children: [],
          },
        ],
      ]) as Schema;

      const originalUserValue = {
        uuid: 'enumerated-parent',
        contents: [
          {
            label: 'Option 1',
            meta: {
              uri: 'http://example.com/option1',
              type: 'enumerated',
            },
          },
          {
            label: 'Option 2',
            meta: {
              uri: 'http://example.com/option2',
              type: 'enumerated',
            },
          },
        ],
      };

      (mockUserValuesService.getValue as jest.Mock).mockReturnValue(originalUserValue);

      (uuidv4 as jest.Mock).mockReturnValueOnce('new-enumerated').mockReturnValueOnce('new-dropdown');

      schemaWithDuplicatesService = new SchemaWithDuplicatesService(
        enumeratedSchema,
        selectedEntriesService,
        undefined,
        mockUserValuesService,
      );

      await act(
        async () =>
          await schemaWithDuplicatesService.duplicateEntry(enumeratedSchema.get('enumerated-parent') as SchemaEntry),
      );

      expect(mockUserValuesService.setValue).toHaveBeenCalledWith({
        type: 'enumerated',
        key: 'new-enumerated',
        value: {
          data: ['http://example.com/option1', 'http://example.com/option2'],
        },
      });
    });

    test('does not duplicate user values when original has no user values', async () => {
      const enumeratedSchema = new Map([
        [
          'enumerated-parent',
          {
            uuid: 'enumerated-parent',
            path: ['enumerated-parent'],
            uriBFLite: 'enumerated-uri',
            type: 'enumerated',
            children: ['dropdown-option-1'],
            constraints: { repeatable: true },
          },
        ],
        [
          'dropdown-option-1',
          {
            uuid: 'dropdown-option-1',
            path: ['enumerated-parent', 'dropdown-option-1'],
            uriBFLite: 'dropdown-option-uri',
            type: 'dropdownOption',
            children: [],
          },
        ],
      ]) as Schema;

      (mockUserValuesService.getValue as jest.Mock).mockReturnValue(undefined);

      (uuidv4 as jest.Mock).mockReturnValueOnce('new-enumerated').mockReturnValueOnce('new-dropdown');

      schemaWithDuplicatesService = new SchemaWithDuplicatesService(
        enumeratedSchema,
        selectedEntriesService,
        undefined,
        mockUserValuesService,
      );

      await act(
        async () =>
          await schemaWithDuplicatesService.duplicateEntry(enumeratedSchema.get('enumerated-parent') as SchemaEntry),
      );

      expect(mockUserValuesService.getValue).toHaveBeenCalledWith('enumerated-parent');
      expect(mockUserValuesService.setValue).not.toHaveBeenCalled();
    });

    test('does not duplicate user values for non-enumerated parent', async () => {
      const nonEnumeratedSchema = new Map([
        [
          'literal-parent',
          {
            uuid: 'literal-parent',
            path: ['literal-parent'],
            uriBFLite: 'literal-uri',
            type: 'literal',
            children: ['child-1'],
            constraints: { repeatable: true },
          },
        ],
        [
          'child-1',
          {
            uuid: 'child-1',
            path: ['literal-parent', 'child-1'],
            children: [],
          },
        ],
      ]) as Schema;

      (uuidv4 as jest.Mock).mockReturnValueOnce('new-literal').mockReturnValueOnce('new-child');

      schemaWithDuplicatesService = new SchemaWithDuplicatesService(
        nonEnumeratedSchema,
        selectedEntriesService,
        undefined,
        mockUserValuesService,
      );

      await act(
        async () =>
          await schemaWithDuplicatesService.duplicateEntry(nonEnumeratedSchema.get('literal-parent') as SchemaEntry),
      );

      expect(mockUserValuesService.setValue).not.toHaveBeenCalled();
    });

    test('does not duplicate user values when child is not dropdownOption', async () => {
      const enumeratedSchema = new Map([
        [
          'enumerated-parent',
          {
            uuid: 'enumerated-parent',
            path: ['enumerated-parent'],
            uriBFLite: 'enumerated-uri',
            type: 'enumerated',
            children: ['literal-child'],
            constraints: { repeatable: true },
          },
        ],
        [
          'literal-child',
          {
            uuid: 'literal-child',
            path: ['enumerated-parent', 'literal-child'],
            type: 'literal',
            children: [],
          },
        ],
      ]) as Schema;

      const originalUserValue = {
        uuid: 'enumerated-parent',
        contents: [
          {
            label: 'Option Label',
            meta: {
              uri: 'http://example.com/option1',
            },
          },
        ],
      };

      (mockUserValuesService.getValue as jest.Mock).mockReturnValue(originalUserValue);

      (uuidv4 as jest.Mock).mockReturnValueOnce('new-enumerated').mockReturnValueOnce('new-literal');

      schemaWithDuplicatesService = new SchemaWithDuplicatesService(
        enumeratedSchema,
        selectedEntriesService,
        undefined,
        mockUserValuesService,
      );

      await act(
        async () =>
          await schemaWithDuplicatesService.duplicateEntry(enumeratedSchema.get('enumerated-parent') as SchemaEntry),
      );

      expect(mockUserValuesService.getValue).toHaveBeenCalledWith('enumerated-parent');
      expect(mockUserValuesService.setValue).not.toHaveBeenCalled();
    });

    test('does not duplicate user values when URIs are empty', async () => {
      const enumeratedSchema = new Map([
        [
          'enumerated-parent',
          {
            uuid: 'enumerated-parent',
            path: ['enumerated-parent'],
            uriBFLite: 'enumerated-uri',
            type: 'enumerated',
            children: ['dropdown-option-1'],
            constraints: { repeatable: true },
          },
        ],
        [
          'dropdown-option-1',
          {
            uuid: 'dropdown-option-1',
            path: ['enumerated-parent', 'dropdown-option-1'],
            uriBFLite: 'dropdown-option-uri',
            type: 'dropdownOption',
            children: [],
          },
        ],
      ]) as Schema;

      const originalUserValue = {
        uuid: 'enumerated-parent',
        contents: [
          {
            label: 'Option Label',
            meta: {
              type: 'enumerated',
            },
          },
        ],
      };

      (mockUserValuesService.getValue as jest.Mock).mockReturnValue(originalUserValue);

      (uuidv4 as jest.Mock).mockReturnValueOnce('new-enumerated').mockReturnValueOnce('new-dropdown');

      schemaWithDuplicatesService = new SchemaWithDuplicatesService(
        enumeratedSchema,
        selectedEntriesService,
        undefined,
        mockUserValuesService,
      );

      await act(
        async () =>
          await schemaWithDuplicatesService.duplicateEntry(enumeratedSchema.get('enumerated-parent') as SchemaEntry),
      );

      expect(mockUserValuesService.getValue).toHaveBeenCalledWith('enumerated-parent');
      expect(mockUserValuesService.setValue).not.toHaveBeenCalled();
    });

    test('duplicates nested enumerated fields with user values', async () => {
      const nestedSchema = new Map([
        [
          'root',
          {
            uuid: 'root',
            path: ['root'],
            children: ['enumerated-parent'],
            constraints: { repeatable: true },
          },
        ],
        [
          'enumerated-parent',
          {
            uuid: 'enumerated-parent',
            path: ['root', 'enumerated-parent'],
            uriBFLite: 'enumerated-uri',
            type: 'enumerated',
            children: ['dropdown-option-1'],
          },
        ],
        [
          'dropdown-option-1',
          {
            uuid: 'dropdown-option-1',
            path: ['root', 'enumerated-parent', 'dropdown-option-1'],
            uriBFLite: 'dropdown-option-uri',
            type: 'dropdownOption',
            children: [],
          },
        ],
      ]) as Schema;

      const originalUserValue = {
        uuid: 'enumerated-parent',
        contents: [
          {
            label: 'Nested Option',
            meta: {
              uri: 'http://example.com/nested-option',
              type: 'enumerated',
            },
          },
        ],
      };

      (mockUserValuesService.getValue as jest.Mock).mockReturnValue(originalUserValue);

      (uuidv4 as jest.Mock)
        .mockReturnValueOnce('new-root')
        .mockReturnValueOnce('new-enumerated')
        .mockReturnValueOnce('new-dropdown');

      schemaWithDuplicatesService = new SchemaWithDuplicatesService(
        nestedSchema,
        selectedEntriesService,
        undefined,
        mockUserValuesService,
      );

      await act(async () => await schemaWithDuplicatesService.duplicateEntry(nestedSchema.get('root') as SchemaEntry));

      expect(mockUserValuesService.getValue).toHaveBeenCalledWith('enumerated-parent');
      expect(mockUserValuesService.setValue).toHaveBeenCalledWith({
        type: 'enumerated',
        key: 'new-enumerated',
        value: {
          data: 'http://example.com/nested-option',
        },
      });
    });
  });
});
