import { profileRecordSchemas } from './profiles';

export class RecordSchemaFactory {
  static getRecordSchema(profileType: ProfileType, entityType: ResourceType): RecordSchema {
    const formattedProfileType = (profileType.charAt(0).toLowerCase() +
      profileType.slice(1)) as keyof typeof profileRecordSchemas;

    if (!profileRecordSchemas[formattedProfileType]) {
      throw new Error(`Unknown profile type: ${profileType}`);
    }

    if (!profileRecordSchemas[formattedProfileType][entityType]) {
      throw new Error(`Unknown entity type ${entityType} for profile ${profileType}`);
    }

    return profileRecordSchemas[formattedProfileType][entityType];
  }
}
