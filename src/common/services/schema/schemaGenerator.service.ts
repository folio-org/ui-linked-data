import { v4 as uuidv4 } from 'uuid';
import { generateEmptyValueUuid } from '@common/helpers/complexLookup.helper';
import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import { ISelectedEntries } from '../selectedEntries/selectedEntries.interface';
import { IEntryPropertiesGeneratorService } from './entryPropertiesGenerator.interface';
import { ISchemaGenerator } from './schemaGenerator.interface';

interface INodeTransformer {
  transform(node: ProfileNode, uuid: string): TransformedNode;
}

interface TransformedNode extends SchemaEntry {
  emptyOptionUuid?: string;
}

interface NodeOptions {
  uuid: string;
  path: string[];
  children?: string[];
  linkedEntry?: LinkedEntry;
}
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

  private processNode(node: ProfileNode): void {
    const uuid = this.idToUuid.get(node.id) ?? '';
    const transformedNode = this.createTransformedNode(node, uuid);

    this.handleNodeSelections(transformedNode);
    this.addNodeToSchema(transformedNode);
  }

  private handleNodeSelections(node: TransformedNode): void {
    if (this.isDropdownWithChildren(node)) {
      this.selectedEntriesService.addNew(undefined, node.children?.[0]);
    }

    if (node.emptyOptionUuid) {
      this.selectedEntriesService.addNew(undefined, node.emptyOptionUuid);
    }
  }

  private isDropdownWithChildren(node: TransformedNode): boolean {
    return node.type === AdvancedFieldType.dropdown && Array.isArray(node.children) && node.children.length > 0;
  }

  private addNodeToSchema(node: TransformedNode): void {
    const schemaNode = { ...node };
    delete schemaNode.emptyOptionUuid;

    this.entryPropertiesGeneratorService?.addEntryWithHtmlId(schemaNode.uuid);
    this.schema.set(schemaNode.uuid, schemaNode);
  }

  private createTransformedNode(node: ProfileNode, uuid: string): TransformedNode {
    const baseNode = this.createBaseNode(node, uuid);
    return this.addEmptyOptionIfNeeded(baseNode);
  }

  private createBaseNode(node: ProfileNode, uuid: string): TransformedNode {
    const nodeOptions: NodeOptions = {
      uuid,
      path: this.getPathForNode(node.id),
      children: this.transformChildren(node.children),
      linkedEntry: this.transformLinkedEntry(node.linkedEntry),
    };

    return {
      ...node,
      ...nodeOptions,
    };
  }

  private addEmptyOptionIfNeeded(node: TransformedNode): TransformedNode {
    if (!node.linkedEntry?.controlledBy) {
      return node;
    }

    const emptyOptionUuid = generateEmptyValueUuid(node.uuid);
    const children = node.children ? [emptyOptionUuid, ...node.children] : [emptyOptionUuid];

    return {
      ...node,
      emptyOptionUuid,
      children,
    };
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
