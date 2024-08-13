import { v4 as uuidv4 } from 'uuid';
import { CONSTRAINTS, RESOURCE_TEMPLATE_IDS, GROUP_BY_LEVEL } from '@common/constants/bibframe.constants';
import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import { getUris } from '@common/helpers/bibframe.helper';
import { getAdvancedFieldType } from '@common/helpers/common.helper';
import { normalizeLayoutProperty } from '@common/helpers/profile.helper';
import { ISelectedEntries } from '@common/services/selectedEntries/selectedEntries.interface';
import { generateEmptyValueUuid } from '@common/helpers/complexLookup.helper';

export class SchemaService {
  private schema: Map<string, SchemaEntry>;
  private supportedEntries: string[];

  constructor(
    private templates: ResourceTemplates,
    private entry: ProfileEntry | ResourceTemplate | PropertyTemplate,
    private selectedEntriesService: ISelectedEntries,
  ) {
    this.schema = new Map();
    this.supportedEntries = Object.keys(RESOURCE_TEMPLATE_IDS);
  }

  generate(initKey: string) {
    try {
      this.traverseProfile({ entry: this.entry, uuid: initKey });
    } catch (error) {
      console.error('Cannot generate a schema', error);
    }

    return this.schema;
  }

  private traverseProfile({ entry, uuid = uuidv4(), path = [], auxType, firstOfSameType = false }: TraverseProfileDTO) {
    const type = auxType || getAdvancedFieldType(entry);
    const updatedPath = [...path, uuid];
    const branchEnds = [AdvancedFieldType.literal, AdvancedFieldType.simple, AdvancedFieldType.complex];

    if (branchEnds.includes(type as AdvancedFieldType)) {
      const {
        id,
        propertyURI,
        propertyLabel,
        mandatory,
        repeatable,
        valueConstraint: { useValuesFrom, editable, valueDataType },
        layout,
        dependsOn,
      } = entry as PropertyTemplate;

      const constraints = {
        ...CONSTRAINTS,
        mandatory: Boolean(mandatory),
        repeatable: Boolean(repeatable),
        editable: Boolean(editable),
        useValuesFrom,
        valueDataType,
      };

      const { uriBFLite } = getUris({
        uri: propertyURI,
        dataTypeURI: valueDataType?.dataTypeURI,
        schema: this.schema,
        path,
      });

      this.schema.set(
        uuid,
        this.generateSchemaEntry(
          {
            bfid: id,
            uuid,
            type,
            path: [...path, uuid],
            displayName: propertyLabel,
            uri: propertyURI,
            uriBFLite,
            constraints,
          },
          layout,
          dependsOn,
        ),
      );
    } else {
      switch (type) {
        // parent types (i.e Monograph)
        case AdvancedFieldType.profile: {
          const { title, id, resourceTemplates } = (entry as ProfileEntry).json.Profile;
          const uuidArray = resourceTemplates.map(() => uuidv4());

          this.schema.set(uuid, {
            uuid,
            type,
            path: updatedPath,
            displayName: title,
            bfid: id,
            children: uuidArray,
          });

          for (const [index, entry] of resourceTemplates.entries()) {
            this.traverseProfile({
              entry,
              uuid: uuidArray[index],
              path: updatedPath,
            });
          }

          return;
        }
        case AdvancedFieldType.hidden:
        case AdvancedFieldType.dropdownOption:
        // i.e. Work, Instance, Item
        case AdvancedFieldType.block: {
          const { id, resourceURI, resourceLabel, propertyTemplates } = entry as ResourceTemplate;
          const { uriBFLite } = getUris({ uri: resourceURI, schema: this.schema, path });
          const uuidArray = propertyTemplates.map(() => uuidv4());
          const isProfileResourceTemplate = path.length <= GROUP_BY_LEVEL;

          if (!this.supportedEntries.includes(id) && isProfileResourceTemplate) return;

          if (type === AdvancedFieldType.dropdownOption && firstOfSameType) {
            this.selectedEntriesService.addNew(undefined, uuid);
          }

          this.schema.set(uuid, {
            uuid,
            type,
            path: updatedPath,
            displayName: resourceLabel,
            bfid: id,
            uri: resourceURI,
            uriBFLite,
            children: uuidArray,
          });

          for (const [index, entry] of propertyTemplates.entries()) {
            this.traverseProfile({
              entry,
              uuid: uuidArray[index],
              path: updatedPath,
            });
          }

          return;
        }
        // parent-intermediate-? types
        case AdvancedFieldType.group:
        case AdvancedFieldType.groupComplex:
        case AdvancedFieldType.dropdown: {
          this.processGroup({
            uuid,
            entry,
            type: type as AdvancedFieldType,
            path,
          });

          return;
        }
        default: {
          console.error('Not implemented.', entry);

          return;
        }
      }
    }
  }

  private processGroup({
    entry,
    path,
    uuid,
    type,
  }: {
    entry: ProfileEntry | ResourceTemplate | PropertyTemplate;
    path: string[];
    uuid: string;
    type: AdvancedFieldType;
  }) {
    const {
      propertyURI,
      propertyLabel,
      mandatory,
      repeatable,
      valueConstraint: { valueTemplateRefs, useValuesFrom, editable, valueDataType },
      layout,
      dependsOn,
    } = entry as PropertyTemplate;
    const { uriBFLite } = getUris({
      uri: propertyURI,
      dataTypeURI: valueDataType?.dataTypeURI,
      schema: this.schema,
      path,
    });

    const constraints = {
      ...CONSTRAINTS,
      mandatory: Boolean(mandatory),
      repeatable: Boolean(repeatable),
      editable: Boolean(editable),
      useValuesFrom,
      valueDataType,
    };

    const newUuid = uuid;
    const uuidArray = valueTemplateRefs.map(() => uuidv4());

    const schemaEntry = this.generateSchemaEntry(
      {
        uuid: newUuid,
        type,
        path: [...path, newUuid],
        displayName: propertyLabel,
        uri: propertyURI,
        uriBFLite,
        constraints,
        children: uuidArray,
      },
      layout,
      dependsOn,
    );

    if (schemaEntry.linkedEntry?.primary) {
      const emptyOptionUuid = generateEmptyValueUuid(newUuid);
      schemaEntry.children = schemaEntry.children ? [emptyOptionUuid, ...schemaEntry.children] : [];

      this.schema.set(emptyOptionUuid, {
        uuid: emptyOptionUuid,
        type: AdvancedFieldType.dropdownOption,
        path: [...path, newUuid, emptyOptionUuid],
        displayName: '',
        bfid: '',
        uri: '',
        uriBFLite: '',
        children: [],
      });

      this.selectedEntriesService.addNew(undefined, emptyOptionUuid);
    }

    this.schema.set(newUuid, schemaEntry);

    // TODO: how to avoid circular references when handling META | HIDE
    if (type === AdvancedFieldType.group) return;

    for (const [index, item] of valueTemplateRefs.entries()) {
      const entry = this.templates[item];

      this.traverseProfile({
        entry,
        auxType: type === AdvancedFieldType.dropdown ? AdvancedFieldType.dropdownOption : AdvancedFieldType.hidden,
        uuid: uuidArray[index],
        path: [...path, newUuid],
        firstOfSameType: index === 0,
      });
    }
  }

  private generateSchemaEntry(schemaEntry: SchemaEntry, layout?: PropertyLayout<string>, dependsOn?: string) {
    if (!layout && !dependsOn) return schemaEntry;

    const updatedSchemaEntry = { ...schemaEntry } as SchemaEntry;

    if (layout) {
      updatedSchemaEntry.layout = normalizeLayoutProperty(layout);
    }

    if (dependsOn) {
      updatedSchemaEntry.dependsOn = dependsOn;

      const parentEntry = this.schema.get(schemaEntry.path[schemaEntry.path.length - 2]);
      const primaryEntry = this.getPrimaryEntry(parentEntry as SchemaEntry, updatedSchemaEntry.dependsOn) as
        | SchemaEntry
        | undefined;

      if (primaryEntry) {
        this.schema.set(primaryEntry.uuid, { ...primaryEntry, linkedEntry: { secondary: updatedSchemaEntry.uuid } });

        updatedSchemaEntry.linkedEntry = { primary: primaryEntry.uuid };
      }
    }

    return updatedSchemaEntry;
  }

  private getPrimaryEntry(parentEntry: SchemaEntry, dependsOnId: string) {
    let primaryEntry: SchemaEntry | undefined;

    parentEntry.children?.forEach(entry => {
      if (primaryEntry) return;

      const childEntry = this.schema.get(entry);

      if (childEntry?.bfid === dependsOnId) {
        primaryEntry = childEntry;
      }
    });

    return primaryEntry;
  }
}
