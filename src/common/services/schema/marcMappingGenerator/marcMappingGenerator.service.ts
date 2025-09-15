import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import { IMarcMappingGenerator } from './marcMappingGenerator.interface';

export class MarcMappingGeneratorService implements IMarcMappingGenerator {
  applyMarcMappingToEntries(schema: Map<string, SchemaEntry>): void {
    schema.forEach(entry => {
      if (entry.type === AdvancedFieldType.block) {
        this.processBlockEntry(entry, schema);
      }
    });
  }

  private processBlockEntry(blockEntry: SchemaEntry, schema: Map<string, SchemaEntry>): void {
    if (!blockEntry.children) return;

    blockEntry.children.forEach(childUuid => {
      const childEntry = schema.get(childUuid);

      if (!childEntry) return;

      this.processChildEntry(childEntry, schema);
    });
  }

  private processChildEntry(entry: SchemaEntry, schema: Map<string, SchemaEntry>): void {
    // If entry has its own MARC value and no children, add marcMapping to itself
    if (entry.marc && (!entry.children || entry.children.length === 0)) {
      this.addMarcMappingToEntry(entry, { [entry.displayName || '']: entry.marc });

      return;
    }

    // If entry has children, collect MARC mappings from children
    if (entry.children && entry.children.length > 0) {
      const marcMapping = this.collectMarcMappingFromChildren(entry, schema);

      if (Object.keys(marcMapping).length > 0) {
        // For dropdown types, we need to handle differently
        if (entry.type === AdvancedFieldType.dropdown || entry.type === AdvancedFieldType.enumerated) {
          this.handleDropdownMarcMapping(entry, marcMapping, schema);
        } else {
          // For non-dropdown entries, add mapping to the entry itself
          this.addMarcMappingToEntry(entry, marcMapping);
        }
      }
    }
  }

  private collectMarcMappingFromChildren(entry: SchemaEntry, schema: Map<string, SchemaEntry>): Record<string, string> {
    const marcMapping: Record<string, string> = {};

    if (!entry.children) return marcMapping;

    // Include entry's own MARC value if it exists
    if (entry.marc && entry.displayName) {
      marcMapping[entry.displayName] = entry.marc;
    }

    entry.children.forEach(childUuid => {
      const childEntry = schema.get(childUuid);
      if (!childEntry) return;

      // If child has MARC value, add it
      if (childEntry.marc && childEntry.displayName) {
        marcMapping[childEntry.displayName] = childEntry.marc;
      }

      // Recursively collect from grandchildren if child doesn't have MARC but has children
      if (!childEntry.marc && childEntry.children && childEntry.children.length > 0) {
        const childMarcMapping = this.collectMarcMappingFromChildren(childEntry, schema);

        Object.assign(marcMapping, childMarcMapping);
      }
    });

    return marcMapping;
  }

  private handleDropdownMarcMapping(
    dropdownEntry: SchemaEntry,
    marcMapping: Record<string, string>,
    schema: Map<string, SchemaEntry>,
  ): void {
    if (!dropdownEntry.children) return;

    // For dropdown, add marcMapping to the dropdown itself if it has direct MARC children
    const hasDirectMarcChildren = dropdownEntry.children.some(childUuid => {
      const child = schema.get(childUuid);

      return child?.marc;
    });

    if (hasDirectMarcChildren) {
      this.addMarcMappingToEntry(dropdownEntry, marcMapping);
    }

    // Also check dropdown options - if an option has children with MARC values, add mapping to the option
    dropdownEntry.children.forEach(optionUuid => {
      const optionEntry = schema.get(optionUuid);

      if (!optionEntry || optionEntry.type !== AdvancedFieldType.dropdownOption) return;

      if (optionEntry.children && optionEntry.children.length > 0) {
        const optionMarcMapping = this.collectMarcMappingFromChildren(optionEntry, schema);

        if (Object.keys(optionMarcMapping).length > 0) {
          this.addMarcMappingToEntry(optionEntry, optionMarcMapping);
        }
      }
    });
  }

  private addMarcMappingToEntry(entry: SchemaEntry, marcMapping: Record<string, string>): void {
    if (!entry.marcMapping) {
      entry.marcMapping = {};
    }

    Object.assign(entry.marcMapping, marcMapping);
  }
}
