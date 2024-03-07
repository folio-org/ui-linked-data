import * as uuid from 'uuid';
import { SchemaWithDuplicatesService } from '@common/services/schema';
import { SelectedEntriesService } from '@common/services/selectedEntries';

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

  beforeEach(() => {
    const selectedEntriesService = new SelectedEntriesService(selectedEntries);
    schemaWithDuplicatesService = new SchemaWithDuplicatesService(schema, selectedEntriesService);
  });

  describe('duplicateEntry', () => {
    const entry = {
      path: ['testKey-0', 'testKey-2', 'testKey-4'],
      uuid: 'testKey-4',
      children: ['testKey-5'],
    };

    test('adds a copied entry', () => {
      jest
        .spyOn(uuid, 'v4')
        .mockReturnValueOnce('testKey-7')
        .mockReturnValueOnce('testKey-8')
        .mockReturnValueOnce('testKey-9')
        .mockReturnValueOnce('testKey-10');

      const constraints = { repeatable: true } as Constraints;
      const entryData = { ...entry, constraints };
      const testResult = new Map([
        ['testKey-0', { path: ['testKey-0'], uuid: 'testKey-0', children: ['testKey-1', 'testKey-2'] }],
        ['testKey-1', { path: ['testKey-0', 'testKey-1'], uuid: 'testKey-1', children: ['testKey-3'] }],
        ['testKey-2', { path: ['testKey-0', 'testKey-2'], uuid: 'testKey-2', children: ['testKey-4', 'testKey-7'] }],
        ['testKey-3', { path: ['testKey-0', 'testKey-1', 'testKey-3'], uuid: 'testKey-3', children: [] }],
        [
          'testKey-4',
          {
            path: ['testKey-0', 'testKey-2', 'testKey-4'],
            uuid: 'testKey-4',
            children: ['testKey-5'],
            clonedBy: ['testKey-7'],
            constraints,
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
            children: ['testKey-8'],
            constraints,
            cloneOf: 'testKey-4',
            clonedBy: undefined,
          },
        ],
        [
          'testKey-8',
          { path: ['testKey-0', 'testKey-2', 'testKey-7', 'testKey-8'], uuid: 'testKey-8', children: ['testKey-9'] },
        ],
        [
          'testKey-9',
          { path: ['testKey-0', 'testKey-2', 'testKey-7', 'testKey-8', 'testKey-9'], uuid: 'testKey-9', children: [] },
        ],
      ]);

      schemaWithDuplicatesService.duplicateEntry(entryData);

      expect(schemaWithDuplicatesService.get()).toEqual(testResult);
    });

    test('does not add a new entry', () => {
      const constraints = { repeatable: false } as Constraints;
      const entryData = { ...entry, constraints };

      schemaWithDuplicatesService.duplicateEntry(entryData);

      expect(schemaWithDuplicatesService.get()).toEqual(schema);
    });
  });
});
