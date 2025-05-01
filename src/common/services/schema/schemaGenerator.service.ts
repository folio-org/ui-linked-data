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

    this.profile.forEach(node => {
      const newUUID = this.idToUUID.get(node.id) ?? '';
      const newNode = {
        ...node,
        uuid: newUUID,
        path: this.getPathForNode(node.id),
      };

      if (newNode.children) {
        newNode.children = newNode.children.map(childId => this.idToUUID.get(childId) ?? childId);
      }

      if (newNode.linkedEntry) {
        if (newNode.linkedEntry.dependent) {
          newNode.linkedEntry.dependent =
            this.idToUUID.get(newNode.linkedEntry.dependent) ?? newNode.linkedEntry.dependent;
        }

        if (newNode.linkedEntry.controlledBy) {
          newNode.linkedEntry.controlledBy =
            this.idToUUID.get(newNode.linkedEntry.controlledBy) ?? newNode.linkedEntry.controlledBy;
        }
      }

      this.schema.set(newNode.uuid, newNode);
    });
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
