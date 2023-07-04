import StorageService from './baseStorage.service';

export default class LocalStorageService extends StorageService {
  constructor() {
    super(localStorage);
  }
}
