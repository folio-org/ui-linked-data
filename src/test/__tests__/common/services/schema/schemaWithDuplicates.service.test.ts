import { act } from '@testing-library/react';
import * as uuid from 'uuid';
import { SchemaWithDuplicatesService } from '@common/services/schema';
import { SelectedEntriesService } from '@common/services/selectedEntries';
import { ISelectedEntries } from '@common/services/selectedEntries/selectedEntries.interface';

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
      jest
        .spyOn(uuid, 'v4')
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
      jest.spyOn(uuid, 'v4').mockReturnValueOnce('testKey-7').mockReturnValueOnce('testKey-8');

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
      jest
        .spyOn(uuid, 'v4')
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
});
