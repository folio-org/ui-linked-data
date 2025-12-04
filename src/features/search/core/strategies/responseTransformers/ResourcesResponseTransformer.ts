import { StandardResponseTransformer } from './StandardResponseTransformer';

export class ResourcesResponseTransformer extends StandardResponseTransformer {
  constructor() {
    super('content');
  }
}
