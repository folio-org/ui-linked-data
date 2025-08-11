import { profileRecordSchemas } from './profiles';

export class RecordSchemaFactory {
  static getRecordSchema(entityType: ResourceType): RecordSchema {
    if (!profileRecordSchemas[entityType]) {
      throw new Error(`Unknown entity type ${entityType}`);
    }

    return profileRecordSchemas[entityType];
  }
}
