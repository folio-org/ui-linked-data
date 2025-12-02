import { StandardResponseTransformer } from './StandardResponseTransformer';

export class AuthoritiesSearchResponseTransformer extends StandardResponseTransformer {
  constructor() {
    super('authorities');
  }
}
