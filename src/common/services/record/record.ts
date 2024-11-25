import { filterUserValues } from '@common/helpers/profile.helper';
import { SchemaTraverser } from './schemaTraverser';
import { IRecord } from './record.interface';

export class RecordGenerator implements IRecord {
  private schema: Map<string, SchemaEntry>;
  private initKey: string | null;
  private userValues: UserValues;
  private selectedEntries: string[];

  constructor(private readonly schemaTraverser: SchemaTraverser) {
    this.schemaTraverser = schemaTraverser;
    this.schema = new Map();
    this.initKey = null;
    this.userValues = {};
    this.selectedEntries = [];
  }

  init({
    schema,
    initKey,
    userValues,
    selectedEntries,
  }: {
    schema: Map<string, SchemaEntry>;
    initKey: string | null;
    userValues: UserValues;
    selectedEntries: string[];
  }) {
    this.schema = schema;
    this.initKey = initKey;
    this.userValues = userValues;
    this.selectedEntries = selectedEntries;
  }

  public generate() {
    if (!Object.keys(this.userValues).length || !this.schema.size || !this.initKey) {
      return;
    }

    const filteredValues = filterUserValues(this.userValues);
    const result: Record<string, RecordEntry> = {};

    this.schemaTraverser
      .init({
        schema: this.schema,
        userValues: filteredValues,
        selectedEntries: this.selectedEntries,
        initialContainer: result,
      })
      .traverse({
        key: this.initKey,
      });

    return result;
  }
}
