import { v4 as uuidv4 } from 'uuid';

import { PROFILE_NODE_ID_DELIMITER } from '@/common/constants/bibframe.constants';
import { DEFAULT_INACTIVE_SETTINGS } from '@/common/constants/profileSettings.constants';
import { AdvancedFieldType } from '@/common/constants/uiControls.constants';

import { generateEmptyValueUuid } from '@/features/complexLookup/utils/complexLookup.helper';

import { IEntryPropertiesGeneratorService } from './entryPropertiesGenerator.interface';
import type { IMarcMappingGenerator } from './marcMappingGenerator';
import { ISchemaGenerator } from './schemaGenerator.interface';

interface TransformedNode extends SchemaEntry {
  emptyOptionUuid?: string;
}

interface NodeOptions {
  uuid: string;
  path: string[];
  children?: string[];
  linkedEntry?: LinkedEntry;
  editorVisible: boolean;
  profileSettingsDrift: boolean;
}
export class SchemaGeneratorService implements ISchemaGenerator {
  private profile: Profile;
  private settings: ProfileSettingsWithDrift;
  private schema: Map<string, SchemaEntry>;
  private idToUuid: Map<string, string>;
  private blockChildren: string[];

  constructor(
    private readonly selectedEntriesService: ISelectedEntriesService,
    private readonly entryPropertiesGeneratorService?: IEntryPropertiesGeneratorService,
    private readonly marcMappingGeneratorService?: IMarcMappingGenerator,
  ) {
    this.profile = [];
    this.settings = DEFAULT_INACTIVE_SETTINGS;
    this.schema = new Map();
    this.idToUuid = new Map();
    this.blockChildren = [];
  }

  init(profile: Profile, settings: ProfileSettingsWithDrift) {
    this.profile = profile;
    this.settings = settings;
    this.schema = new Map();
    this.idToUuid = new Map();
    this.blockChildren = [];
  }

  get() {
    return this.schema;
  }

  generate(initKey: string) {
    this.transformidToUuid(initKey);
    this.profile.forEach(node => this.processNode(node));
    this.entryPropertiesGeneratorService?.applyHtmlIdToEntries(this.schema);
    this.marcMappingGeneratorService?.applyMarcMappingToEntries(this.schema);
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
    return (
      (node.type === AdvancedFieldType.dropdown || node.type === AdvancedFieldType.enumerated) &&
      Array.isArray(node.children) &&
      node.children.length > 0
    );
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
      children: this.transformChildren(node.type, node.uriBFLite, node.children),
      linkedEntry: this.transformLinkedEntry(node.linkedEntry),
      editorVisible: this.getEditorVisibility(node.id),
      profileSettingsDrift: this.hasProfileSettingsDrift(node.id),
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

    this.schema.set(emptyOptionUuid, {
      uuid: emptyOptionUuid,
      type: AdvancedFieldType.dropdownOption,
      path: [...node.path, emptyOptionUuid],
      displayName: '',
      bfid: '',
      uri: '',
      uriBFLite: '',
      children: [],
    });

    return {
      ...node,
      emptyOptionUuid,
      children,
    };
  }

  private transformChildren(type: string, uri?: string, children?: string[]) {
    if (!children) return undefined;

    if (type === AdvancedFieldType.block && this.settings.active && this.settings.resourceTypeURL === uri) {
      return this.transformBlockChildrenOrdering(children);
    }

    return children.map(childId => this.transformLinkedId(childId));
  }

  private transformLinkedEntry(linkedEntry?: LinkedEntry) {
    if (!linkedEntry) return undefined;

    return {
      ...linkedEntry,
      dependent: this.transformLinkedId(linkedEntry.dependent),
      controlledBy: this.transformLinkedId(linkedEntry.controlledBy),
    };
  }

  private transformLinkedId(id: undefined): undefined;
  private transformLinkedId(id: string): string;
  private transformLinkedId(id: string | undefined): string | undefined;
  private transformLinkedId(id?: string) {
    if (!id) return undefined;

    return this.idToUuid.get(id) ?? id;
  }

  private transformidToUuid(initKey: string) {
    this.profile.forEach((node, index) => {
      const newUuid = index === 0 ? initKey : uuidv4();

      this.idToUuid.set(node.id, newUuid);
    });
  }

  private getPathForNode(nodeId: string | null) {
    const path = [];
    let currentId = nodeId;

    while (currentId) {
      const currentUuid = this.idToUuid.get(currentId);

      if (currentUuid) {
        path.unshift(currentUuid);
      }

      currentId = currentId.includes(PROFILE_NODE_ID_DELIMITER)
        ? currentId.split(PROFILE_NODE_ID_DELIMITER).slice(0, -1).join(PROFILE_NODE_ID_DELIMITER)
        : null;
    }

    return path;
  }

  private getEditorVisibility(nodeId: string) {
    if (!this.settings.active || !this.blockChildren.includes(nodeId)) {
      return true;
    }

    // Bypass setting if mandatory
    const profileNode = this.profile.find(child => child.id === nodeId);
    if (profileNode?.constraints?.mandatory) {
      return true;
    }

    const setting = this.settings.children?.find(child => child.id === nodeId);
    return setting?.visible ?? true;
  }

  private hasProfileSettingsDrift(nodeId: string) {
    if (!this.settings.active || !this.blockChildren.includes(nodeId)) {
      return false;
    }

    return this.settings.missingFromSettings.includes(nodeId);
  }

  private transformBlockChildrenOrdering(children: string[]) {
    const orderedChildren: string[] = [];

    this.blockChildren = children;
    this.settings.children?.forEach(setting => {
      const found = children.find(child => child === setting.id);
      if (found) {
        const entry = this.transformLinkedId(setting.id);
        entry && orderedChildren.push(entry);
      }
    });

    return [...orderedChildren, ...this.settings.missingFromSettings.map(childId => this.transformLinkedId(childId))];
  }
}
