import { StandardResponseTransformer } from './StandardResponseTransformer';

export class HubLocalResponseTransformer extends StandardResponseTransformer {
  constructor() {
    super('content');
  }
}
