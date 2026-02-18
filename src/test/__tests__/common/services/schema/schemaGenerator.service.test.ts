import { v4 as uuidv4 } from 'uuid';

import { DEFAULT_INACTIVE_SETTINGS } from '@/common/constants/profileSettings.constants';
import { AdvancedFieldType } from '@/common/constants/uiControls.constants';
import { SchemaGeneratorService } from '@/common/services/schema';

import { generateEmptyValueUuid } from '@/features/complexLookup/utils/complexLookup.helper';

jest.mock('uuid');
jest.mock('@/features/complexLookup/utils/complexLookup.helper');

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
    it('initializes with empty profile and inactive settings', () => {
      const profile = [] as Profile;

      service.init(profile, DEFAULT_INACTIVE_SETTINGS);

      expect(service.get().size).toBe(0);
    });

    it('clears previous data on initialization', () => {
      const initialProfile = [
        {
          id: 'test',
          type: AdvancedFieldType.literal,
        },
      ] as Profile;
      service.init(initialProfile, DEFAULT_INACTIVE_SETTINGS);

      const newProfile = [] as Profile;
      service.init(newProfile, DEFAULT_INACTIVE_SETTINGS);

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
      service.init(testProfile, DEFAULT_INACTIVE_SETTINGS);
    });

    it('generates schema with transformed nodes', () => {
      service.generate('init-key');

      const schema = service.get();

      expect(schema.size).toBe(3);
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

      service.init(nestedProfile, DEFAULT_INACTIVE_SETTINGS);
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

      service.init(profile, DEFAULT_INACTIVE_SETTINGS);
      service.generate('init-key');

      const schema = service.get();

      expect(schema.size).toBe(1);
      expect(schema.get('init-key')).toBeDefined();
    });
  });

  describe('profile settings', () => {
    const baseProfile = [
      {
        id: 'document',
        type: AdvancedFieldType.block,
        children: ['a', '6', 'r'],
      },
      {
        id: 'a',
        type: AdvancedFieldType.literal,
      },
      {
        id: '6',
        type: AdvancedFieldType.literal,
      },
      {
        id: 'r',
        type: AdvancedFieldType.literal,
      },
    ] as Profile;

    beforeEach(() => {
      (uuidv4 as jest.Mock).mockImplementation(Math.random);
    });

    describe('block child ordering', () => {
      it.each([
        ['inactive, empty settings have no effect', DEFAULT_INACTIVE_SETTINGS, ['a', '6', 'r']],
        [
          'inactive settings with children and drift have no effect',
          {
            active: false,
            children: [
              {
                id: 'r',
              },
              {
                id: 'a',
              },
            ],
            missingFromSettings: ['6'],
          } as ProfileSettingsWithDrift,
          ['a', '6', 'r'],
        ],
        [
          'active settings with no children use drift order',
          {
            active: true,
            children: [],
            missingFromSettings: ['6', 'r', 'a'],
          } as ProfileSettingsWithDrift,
          ['6', 'r', 'a'],
        ],
        [
          'active settings with all children and no drift use settings order',
          {
            active: true,
            children: [
              {
                id: 'r',
                visible: true,
              },
              {
                id: 'a',
                visible: true,
              },
              {
                id: '6',
                visible: true,
              },
            ],
            missingFromSettings: [],
          } as ProfileSettingsWithDrift,
          ['r', 'a', '6'],
        ],
        [
          'active settings with all children and no drift use settings order',
          {
            active: true,
            children: [
              {
                id: '6',
                visible: true,
              },
            ],
            missingFromSettings: ['a', 'r'],
          } as ProfileSettingsWithDrift,
          ['6', 'a', 'r'],
        ],
      ])('%s', (_title, settings, expected) => {
        service.init(baseProfile, settings);
        service.generate('init-key');

        const schema = service.get();
        const node = schema.get('init-key');
        const children = node?.children?.map(childId => (schema.get(childId) as ProfileNode).id);

        expect(children).toEqual(expected);
      });
    });

    describe('node options for visibility and drift', () => {
      const baseProfile = [
        {
          id: 'document',
          type: AdvancedFieldType.block,
          children: ['a', '6', 'r'],
        },
        {
          id: 'a',
          type: AdvancedFieldType.literal,
        },
        {
          id: '6',
          type: AdvancedFieldType.literal,
        },
        {
          id: 'r',
          type: AdvancedFieldType.literal,
        },
      ] as Profile;

      beforeEach(() => {
        (uuidv4 as jest.Mock).mockImplementation(Math.random);
      });

      it('inactive, empty settings have all visible and no drift', () => {
        service.init(baseProfile, DEFAULT_INACTIVE_SETTINGS);
        service.generate('init-key');

        const schema = service.get();
        const node = schema.get('init-key');
        node?.children?.forEach(childId => {
          const child = schema.get(childId);
          expect(child?.editorVisible).toBe(true);
          expect(child?.profileSettingsDrift).toBe(false);
        });
      });

      it('inactive settings with children and drift have all visible and no drift', () => {
        const settings = {
          active: false,
          children: [
            {
              id: 'r',
            },
            {
              id: 'a',
            },
          ],
          missingFromSettings: ['6'],
        } as ProfileSettingsWithDrift;

        service.init(baseProfile, settings);
        service.generate('init-key');

        const schema = service.get();
        const node = schema.get('init-key');
        node?.children?.forEach(childId => {
          const child = schema.get(childId);
          expect(child?.editorVisible).toBe(true);
          expect(child?.profileSettingsDrift).toBe(false);
        });
      });

      it('active settings with no children have all visible and all drift', () => {
        const settings = {
          active: true,
          children: [],
          missingFromSettings: ['6', 'r', 'a'],
        } as ProfileSettingsWithDrift;

        service.init(baseProfile, settings);
        service.generate('init-key');

        const schema = service.get();
        const node = schema.get('init-key');
        node?.children?.forEach(childId => {
          const child = schema.get(childId);
          expect(child?.editorVisible).toBe(true);
          expect(child?.profileSettingsDrift).toBe(true);
        });
      });

      it('active settings with all children and no drift have settings visibility and no drift', () => {
        const settings = {
          active: true,
          children: [
            {
              id: 'r',
              visible: true,
            },
            {
              id: 'a',
              visible: false,
            },
            {
              id: '6',
              visible: true,
            },
          ],
          missingFromSettings: [],
        } as ProfileSettingsWithDrift;
        const visibles = ['6', 'r'];

        service.init(baseProfile, settings);
        service.generate('init-key');

        const schema = service.get();
        const node = schema.get('init-key');
        node?.children?.forEach(childId => {
          const child = schema.get(childId);
          expect(child?.editorVisible).toBe(visibles.includes((child as ProfileNode).id));
          expect(child?.profileSettingsDrift).toBe(false);
        });
      });

      it('active settings with some children and some drift have settings visibility and some drift', () => {
        const settings = {
          active: true,
          children: [
            {
              id: '6',
              visible: false,
            },
          ],
          missingFromSettings: ['a', 'r'],
        } as ProfileSettingsWithDrift;
        const visibles = ['a', 'r'];
        const drifts = ['a', 'r'];

        service.init(baseProfile, settings);
        service.generate('init-key');

        const schema = service.get();
        const node = schema.get('init-key');
        node?.children?.forEach(childId => {
          const child = schema.get(childId);
          expect(child?.editorVisible).toBe(visibles.includes((child as ProfileNode).id));
          expect(child?.profileSettingsDrift).toBe(drifts.includes((child as ProfileNode).id));
        });
      });

      it('active settings with some children not visible are bypassed when mandatory', () => {
        const profileWithMandatory = [
          {
            id: 'document',
            type: AdvancedFieldType.block,
            children: ['a'],
          },
          {
            id: 'a',
            type: AdvancedFieldType.literal,
            constraints: {
              mandatory: true,
            },
          },
        ] as Profile;
        const settings = {
          active: true,
          children: [
            {
              id: 'a',
              visible: false,
            },
          ],
          missingFromSettings: [],
        } as ProfileSettingsWithDrift;
        const visibles = ['a'];

        service.init(profileWithMandatory, settings);
        service.generate('init-key');

        const schema = service.get();
        const node = schema.get('init-key');

        node?.children?.forEach(childId => {
          const child = schema.get(childId);
          expect(child?.editorVisible).toBe(visibles.includes((child as ProfileNode).id));
        });
      });
    });
  });
});
