import { profileRecordSchemas } from './profiles';

export class RecordSchemaFactory {
  static getRecordSchema(profileType: ProfileType, entityType: ResourceType): RecordSchema {
    if (!profileRecordSchemas[profileType]) {
      throw new Error(`Unknown profile type: ${profileType}`);
    }

    if (!profileRecordSchemas[profileType][entityType]) {
      throw new Error(`Unknown entity type ${entityType} for profile ${profileType}`);
    }

    return profileRecordSchemas[profileType][entityType];
  }
}
