export * from './authorities';
export * from './hub';
export * from './resources';

import { AuthoritiesResultFormatter } from './authorities';
import { HubsResultFormatter } from './hub';
import { ResourcesResultFormatter } from './resources';

// Registry for backward compatibility with complex lookup
export const SEARCH_RESULTS_FORMATTER = {
  default: new AuthoritiesResultFormatter(),
  authorities: new AuthoritiesResultFormatter(),
  hub: new HubsResultFormatter(),
  resources: new ResourcesResultFormatter(),
};
