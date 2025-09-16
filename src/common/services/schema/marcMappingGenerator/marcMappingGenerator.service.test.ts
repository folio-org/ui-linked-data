import { MarcMappingGeneratorService } from './marcMappingGenerator.service';
import { AdvancedFieldType } from '@common/constants/uiControls.constants';

describe('MarcMappingGeneratorService', () => {
  let service: MarcMappingGeneratorService;
  let schema: Map<string, SchemaEntry>;

  beforeEach(() => {
    service = new MarcMappingGeneratorService();
    schema = new Map();
  });

  function addEntry(entry: Partial<SchemaEntry> & { uuid: string }): SchemaEntry {
    const fullEntry: SchemaEntry = {
      uuid: entry.uuid,
      type: entry.type,
      path: entry.path || [],
      displayName: entry.displayName || '',
      bfid: entry.bfid || '',
      uri: entry.uri || '',
      uriBFLite: entry.uriBFLite || '',
      children: entry.children || [],
      marc: entry.marc,
      marcMapping: entry.marcMapping,
    };

    schema.set(fullEntry.uuid, fullEntry);

    return fullEntry;
  }

  test('adds marcMapping to leaf entry with marc', () => {
    addEntry({ uuid: '1', type: AdvancedFieldType.block, children: ['2'] });
    const entry = addEntry({ uuid: '2', marc: '245$a', displayName: 'Title', type: AdvancedFieldType.literal });

    service.applyMarcMappingToEntries(schema);

    expect(entry.marcMapping).toEqual({ Title: '245$a' });
  });

  test('collects marcMapping from children', () => {
    const parent = addEntry({ uuid: '1', type: AdvancedFieldType.block, children: ['2', '3'] });
    const child_1 = addEntry({ uuid: '2', type: AdvancedFieldType.literal, marc: '245$a', displayName: 'Title' });
    const child_2 = addEntry({ uuid: '3', type: AdvancedFieldType.literal, marc: '100$a', displayName: 'Author' });

    service.applyMarcMappingToEntries(schema);

    expect(child_1.marcMapping).toEqual({ Title: '245$a' });
    expect(child_2.marcMapping).toEqual({ Author: '100$a' });
    // Parent should not have marcMapping since it's a block
    expect(parent.marcMapping).toBeUndefined();
  });

  test('adds marcMapping to parent with children', () => {
    addEntry({ uuid: '1', type: AdvancedFieldType.block, children: ['2'] });
    const child = addEntry({ uuid: '2', children: ['3', '4'] });
    addEntry({ uuid: '3', type: AdvancedFieldType.literal, marc: '245$a', displayName: 'Title' });
    addEntry({ uuid: '4', type: AdvancedFieldType.literal, marc: '100$a', displayName: 'Author' });

    service.applyMarcMappingToEntries(schema);

    expect(child.marcMapping).toEqual({ Title: '245$a', Author: '100$a' });
  });

  test('handles dropdown and enumerated types', () => {
    addEntry({ uuid: '1', type: AdvancedFieldType.block, children: ['2'] });
    const dropdown = addEntry({ uuid: '2', type: AdvancedFieldType.dropdown, children: ['3', '4'] });
    const option_1 = addEntry({ uuid: '3', type: AdvancedFieldType.dropdownOption, children: ['5'] });
    addEntry({ uuid: '4', type: AdvancedFieldType.dropdownOption });
    addEntry({ uuid: '5', type: AdvancedFieldType.literal, marc: '650$a', displayName: 'Subject' });

    service.applyMarcMappingToEntries(schema);

    expect(option_1.marcMapping).toEqual({ Subject: '650$a' });
    expect(dropdown.marcMapping).toBeUndefined(); // No direct marc children
  });

  test('adds marcMapping to dropdown with direct marc children', () => {
    addEntry({ uuid: '1', type: AdvancedFieldType.block, children: ['2'] });
    const dropdown = addEntry({ uuid: '2', type: AdvancedFieldType.dropdown, children: ['3', '4'] });
    addEntry({ uuid: '3', type: AdvancedFieldType.dropdownOption, marc: '650$a', displayName: 'Subject' });
    addEntry({ uuid: '4', type: AdvancedFieldType.dropdownOption });

    service.applyMarcMappingToEntries(schema);

    expect(dropdown.marcMapping).toEqual({ Subject: '650$a' });
  });

  test('does not add marcMapping if no marc present', () => {
    const entry = addEntry({ uuid: '1', type: AdvancedFieldType.literal, displayName: 'NoMarc' });

    service.applyMarcMappingToEntries(schema);

    expect(entry.marcMapping).toBeUndefined();
  });
});
