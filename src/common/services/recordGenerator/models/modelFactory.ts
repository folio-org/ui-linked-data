import { profileModels } from './profiles';

export class ModelFactory {
  static getModel(profileType: ProfileType, entityType: ResourceType): RecordModel {
    if (!profileModels[profileType]) {
      throw new Error(`Unknown profile type: ${profileType}`);
    }

    if (!profileModels[profileType][entityType]) {
      throw new Error(`Unknown entity type ${entityType} for profile ${profileType}`);
    }

    return profileModels[profileType][entityType];
  }
}
