import { AuthoritiesResultFormatter } from './authorities';
import { HubsLookupResultFormatter } from './hubLookup';
import { ResourcesResultFormatter } from './resources';

export * from './authorities';
export * from './hubLookup';
export * from './hub';
export * from './hubLocal';
export * from './resources';

// Registry for backward compatibility with complex lookup
export const SEARCH_RESULTS_FORMATTER = {
  default: new AuthoritiesResultFormatter(),
  authorities: new AuthoritiesResultFormatter(),
  hub: new HubsLookupResultFormatter(),
  resources: new ResourcesResultFormatter(),
};
