import { StandardResponseTransformer } from './StandardResponseTransformer';

export class LDAuthoritiesResponseTransformer extends StandardResponseTransformer {
  constructor() {
    super('authorities');
  }
}
