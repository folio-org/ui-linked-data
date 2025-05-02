import { v4 as uuidv4 } from 'uuid';
import { SchemaGeneratorService } from '@common/services/schema';
import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import { generateEmptyValueUuid } from '@common/helpers/complexLookup.helper';

jest.mock('uuid');
jest.mock('@common/helpers/complexLookup.helper');

describe('SchemaGeneratorService', () => {
  const mockSelectedEntriesService = {
    addNew: jest.fn(),
  } as unknown as ISelectedEntriesService;

  const mockEntryPropertiesGeneratorService = {
    addEntryWithHtmlId: jest.fn(),
    applyHtmlIdToEntries: jest.fn(),
  };

  let service: SchemaGeneratorService;

  beforeEach(() => {
    (uuidv4 as jest.Mock).mockReturnValue('generated-uuid');
    (generateEmptyValueUuid as jest.Mock).mockReturnValue('empty-uuid');

    service = new SchemaGeneratorService(mockSelectedEntriesService, mockEntryPropertiesGeneratorService);
  });

  describe('init', () => {
    it('initializes with empty profile', () => {
      const profile = [] as Profile;

      service.init(profile);

      expect(service.get().size).toBe(0);
    });

    it('clears previous data on initialization', () => {
      const initialProfile = [
        {
          id: 'test',
          type: AdvancedFieldType.literal,
        },
      ] as Profile;
      service.init(initialProfile);

      const newProfile = [] as Profile;
      service.init(newProfile);

      expect(service.get().size).toBe(0);
    });
  });

  describe('generate', () => {
    const testProfile = [
      {
        id: 'root',
        type: AdvancedFieldType.dropdown,
        children: ['root:child'],
      },
      {
        id: 'root:child',
        type: AdvancedFieldType.literal,
        linkedEntry: {
          controlledBy: 'root',
        },
      },
    ] as Profile;

    beforeEach(() => {
      service.init(testProfile);
    });

    it('generates schema with transformed nodes', () => {
      service.generate('init-key');

      const schema = service.get();

      expect(schema.size).toBe(2);
      expect(schema.has('init-key')).toBeTruthy();
      expect(schema.has('generated-uuid')).toBeTruthy();
    });

    it('applies HTML ids to entries', () => {
      service.generate('init-key');

      expect(mockEntryPropertiesGeneratorService.applyHtmlIdToEntries).toHaveBeenCalledWith(service.get());
    });

    it('handles dropdown selections', () => {
      service.generate('init-key');

      expect(mockSelectedEntriesService.addNew).toHaveBeenCalledWith(undefined, 'generated-uuid');
    });

    it('handles empty options for controlled nodes', () => {
      service.generate('init-key');

      const schema = service.get();
      const childNode = schema.get('generated-uuid');

      expect(childNode?.children?.[0]).toBe('empty-uuid');
      expect(mockSelectedEntriesService.addNew).toHaveBeenCalledWith(undefined, 'empty-uuid');
    });

    it('generates correct paths for nested nodes', () => {
      const nestedProfile = [
        {
          id: 'parent',
          type: AdvancedFieldType.literal,
          children: ['parent:child'],
        },
        {
          id: `parent:child`,
          type: AdvancedFieldType.literal,
        },
      ] as Profile;

      service.init(nestedProfile);
      service.generate('init-key');

      const schema = service.get();
      const childNode = schema.get('generated-uuid');

      expect(childNode?.path).toEqual(['init-key', 'generated-uuid']);
    });
  });

  describe('get', () => {
    it('returns empty schema by default', () => {
      expect(service.get().size).toBe(0);
    });

    it('returns current schema state', () => {
      const profile = [
        {
          id: 'test',
          type: AdvancedFieldType.literal,
        },
      ] as Profile;

      service.init(profile);
      service.generate('init-key');

      const schema = service.get();

      expect(schema.size).toBe(1);
      expect(schema.get('init-key')).toBeDefined();
    });
  });
});
