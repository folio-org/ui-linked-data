import { v4 as uuidv4 } from 'uuid';
import { ISelectedEntries } from '../selectedEntries/selectedEntries.interface';
import { IEntryPropertiesGeneratorService } from './entryPropertiesGenerator.interface';
import { ISchemaGenerator } from './schemaGenerator.interface';

export class SchemaGeneratorService implements ISchemaGenerator {
  private profile: Profile;
  private schema: Map<string, SchemaEntry>;
  private idToUUID: Map<string, string>;

  constructor(
    private readonly selectedEntriesService: ISelectedEntries,
    private readonly entryPropertiesGeneratorService?: IEntryPropertiesGeneratorService,
  ) {
    this.profile = [];
    this.schema = new Map();
    this.idToUUID = new Map();
  }

  init(profile: Profile) {
    this.profile = profile;
    this.schema = new Map();
    this.idToUUID = new Map();
  }

  get() {
    return this.schema;
  }

  generate(initKey: string) {
    this.transformIdToUUID(initKey);

    this.profile.forEach(node => this.processNode(node));
  }

  private processNode(node: ProfileNode): void {
    const uuid = this.idToUUID.get(node.id) ?? '';
    const newNode = this.createTransformedNode(node, uuid);

    this.schema.set(newNode.uuid, newNode);
  }

  private createTransformedNode(node: ProfileNode, uuid: string): SchemaEntry {
    return {
      ...node,
      uuid,
      path: this.getPathForNode(node.id),
      children: this.transformChildren(node.children),
      linkedEntry: this.transformLinkedEntry(node.linkedEntry),
    };
  }

  private transformChildren(children?: string[]): string[] | undefined {
    if (!children) return undefined;

    return children.map(childId => this.idToUUID.get(childId) ?? childId);
  }

  private transformLinkedEntry(linkedEntry?: LinkedEntry): LinkedEntry | undefined {
    if (!linkedEntry) return undefined;

    return {
      ...linkedEntry,
      dependent: this.transformLinkedId(linkedEntry.dependent),
      controlledBy: this.transformLinkedId(linkedEntry.controlledBy),
    };
  }

  private transformLinkedId(id?: string): string | undefined {
    if (!id) return undefined;

    return this.idToUUID.get(id) ?? id;
  }

  private transformIdToUUID(initKey: string) {
    this.profile.forEach((node, index) => {
      const newUUID = index === 0 ? initKey : uuidv4();

      this.idToUUID.set(node.id, newUUID);
    });
  }

  private getPathForNode(nodeId: string | null) {
    const path = [];
    let currentId = nodeId;

    while (currentId) {
      const currentUUID = this.idToUUID.get(currentId);

      if (currentUUID) {
        path.unshift(currentUUID);
      }

      currentId = currentId.includes(':') ? currentId.split(':').slice(0, -1).join(':') : null;
    }

    return path;
  }
}
