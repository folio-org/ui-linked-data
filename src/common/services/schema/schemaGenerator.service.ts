import { v4 as uuidv4 } from 'uuid';
import { generateEmptyValueUuid } from '@common/helpers/complexLookup.helper';
import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import { ISelectedEntries } from '../selectedEntries/selectedEntries.interface';
import { IEntryPropertiesGeneratorService } from './entryPropertiesGenerator.interface';
import { ISchemaGenerator } from './schemaGenerator.interface';

export class SchemaGeneratorService implements ISchemaGenerator {
  private profile: Profile;
  private schema: Map<string, SchemaEntry>;
  private idToUuid: Map<string, string>;

  constructor(
    private readonly selectedEntriesService: ISelectedEntries,
    private readonly entryPropertiesGeneratorService?: IEntryPropertiesGeneratorService,
  ) {
    this.profile = [];
    this.schema = new Map();
    this.idToUuid = new Map();
  }

  init(profile: Profile) {
    this.profile = profile;
    this.schema = new Map();
    this.idToUuid = new Map();
  }

  get() {
    return this.schema;
  }

  generate(initKey: string) {
    this.transformidToUuid(initKey);
    this.profile.forEach(node => this.processNode(node));
    this.entryPropertiesGeneratorService?.applyHtmlIdToEntries(this.schema);
  }

  private processNode(node: ProfileNode) {
    const uuid = this.idToUuid.get(node.id) ?? '';
    const { emptyOptionUuid, ...newNode } = this.createTransformedNode(node, uuid);

    // Select first dropdown option if this is a dropdown node
    if (newNode.type === AdvancedFieldType.dropdown && newNode.children?.length) {
      const firstOptionId = newNode.children[0];

      this.selectedEntriesService.addNew(undefined, firstOptionId);
    }

    // If this node has an empty option value, select it
    if (emptyOptionUuid) {
      this.selectedEntriesService.addNew(undefined, emptyOptionUuid);
    }

    this.entryPropertiesGeneratorService?.addEntryWithHtmlId(uuid);

    this.schema.set(newNode.uuid, newNode);
  }

  private createTransformedNode(node: ProfileNode, uuid: string) {
    const transformedNode = {
      ...node,
      uuid,
      path: this.getPathForNode(node.id),
      children: this.transformChildren(node.children),
      linkedEntry: this.transformLinkedEntry(node.linkedEntry),
    } as SchemaEntry & { emptyOptionUuid?: string };

    // Add empty option for controlled fields
    if (transformedNode.linkedEntry?.controlledBy) {
      const emptyOptionUuid = generateEmptyValueUuid(uuid);

      transformedNode.emptyOptionUuid = emptyOptionUuid;
      transformedNode.children = transformedNode.children
        ? [emptyOptionUuid, ...transformedNode.children]
        : [emptyOptionUuid];
    }

    return transformedNode;
  }

  private transformChildren(children?: string[]) {
    if (!children) return undefined;

    return children.map(childId => this.idToUuid.get(childId) ?? childId);
  }

  private transformLinkedEntry(linkedEntry?: LinkedEntry) {
    if (!linkedEntry) return undefined;

    return {
      ...linkedEntry,
      dependent: this.transformLinkedId(linkedEntry.dependent),
      controlledBy: this.transformLinkedId(linkedEntry.controlledBy),
    };
  }

  private transformLinkedId(id?: string) {
    if (!id) return undefined;

    return this.idToUuid.get(id) ?? id;
  }

  private transformidToUuid(initKey: string) {
    this.profile.forEach((node, index) => {
      const newUUID = index === 0 ? initKey : uuidv4();

      this.idToUuid.set(node.id, newUUID);
    });
  }

  private getPathForNode(nodeId: string | null) {
    const path = [];
    let currentId = nodeId;

    while (currentId) {
      const currentUUID = this.idToUuid.get(currentId);

      if (currentUUID) {
        path.unshift(currentUUID);
      }

      currentId = currentId.includes(':') ? currentId.split(':').slice(0, -1).join(':') : null;
    }

    return path;
  }
}
