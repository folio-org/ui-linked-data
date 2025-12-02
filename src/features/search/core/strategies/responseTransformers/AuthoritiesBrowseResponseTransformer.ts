import { StandardResponseTransformer } from './StandardResponseTransformer';

export class AuthoritiesBrowseResponseTransformer extends StandardResponseTransformer {
  constructor() {
    super('items');
  }
}
