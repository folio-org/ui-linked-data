import { BFLITE_URIS } from '@/common/constants/bibframeMapping.constants';
import { AdvancedFieldType } from '@/common/constants/uiControls.constants';

import { ProcessContext } from '../../types/common.types';
import { ProcessorResult } from '../../types/profileSchemaProcessor.types';
import { BaseDropdownProcessor } from './baseDropdownProcessor';

export class FlattenedDropdownProcessor extends BaseDropdownProcessor {
  canProcess(profileSchemaEntry: SchemaEntry, recordSchemaEntry: RecordSchemaEntry) {
    return (
      (profileSchemaEntry.type === AdvancedFieldType.dropdown ||
        profileSchemaEntry.type === AdvancedFieldType.enumerated) &&
      recordSchemaEntry.options?.flattenDropdown === true
    );
  }

  process(data: ProcessContext) {
    this.initializeProcessor(data);

    const sourceProperty = data.recordSchemaEntry.options?.sourceProperty ?? BFLITE_URIS.SOURCE;
    const dropdownResults = this.processDropdownChildren(data.profileSchemaEntry, data.selectedEntries);

    return dropdownResults.map(result => {
      // Each result is an object with a single key (the URI) and its associated value
      const uri = Object.keys(result)[0]; // Get the URI from the first (and only) key
      const value = Object.values(result)[0]; // Get the associated value

      return {
        [sourceProperty]: [uri],
        ...value,
      } as ProcessorResult;
    });
  }

  protected processOptionEntry(optionEntry: SchemaEntry) {
    if (!optionEntry.uriBFLite) return null;

    const childrenResults = this.processChildren(optionEntry);

    if (Object.keys(childrenResults).length === 0) return null;

    return {
      [optionEntry.uriBFLite]: childrenResults,
    };
  }
}
