import type { SearchTypeUIConfig } from '../types';

const mockSearchUIRegistry = {
  authorities: {
    ui: { titleId: 'authorities.title' },
    segments: {
      search: { ui: { titleId: 'search.title' } },
      browse: { ui: { titleId: 'browse.title' } },
    },
  },
  resources: {
    ui: { titleId: 'resources.title' },
  },
  hubs: {
    ui: { titleId: 'hubs.title' },
    segments: {
      internal: { ui: { titleId: 'internal.title' } },
      external: { ui: { titleId: 'external.title' } },
    },
  },
};

jest.mock('./searchUIRegistry', () => ({
  searchUIRegistry: mockSearchUIRegistry,
}));

import { resolveUIConfig, getUIRegistryKey, getDefaultUISegment } from './resolveUIConfig';

describe('getUIRegistryKey', () => {
  it('returns the segment itself when it exists in registry', () => {
    const result = getUIRegistryKey('authorities');
    expect(result).toBe('authorities');
  });

  it('returns parent key for composite segment', () => {
    const result = getUIRegistryKey('authorities:search');
    expect(result).toBe('authorities');
  });

  it('returns parent key for deeply nested composite segment', () => {
    const result = getUIRegistryKey('authorities:search:advanced');
    expect(result).toBe('authorities');
  });

  it('returns undefined for segment not in registry', () => {
    const result = getUIRegistryKey('nonexistent');
    expect(result).toBeUndefined();
  });

  it('returns undefined for composite segment with parent not in registry', () => {
    const result = getUIRegistryKey('nonexistent:child');
    expect(result).toBeUndefined();
  });

  it('returns undefined for undefined segment', () => {
    const result = getUIRegistryKey(undefined as unknown as string);
    expect(result).toBeUndefined();
  });

  it('returns undefined for null segment', () => {
    const result = getUIRegistryKey(null as unknown as string);
    expect(result).toBeUndefined();
  });

  it('returns undefined for empty string segment', () => {
    const result = getUIRegistryKey('');
    expect(result).toBeUndefined();
  });

  it('returns undefined for non-string segment', () => {
    const result = getUIRegistryKey(123 as unknown as string);
    expect(result).toBeUndefined();
  });

  it('handles segment with colon but no parent correctly', () => {
    const result = getUIRegistryKey(':search');
    expect(result).toBeUndefined();
  });
});

describe('resolveUIConfig', () => {
  it('resolves simple segment from registry', () => {
    const result = resolveUIConfig('resources');

    expect(result).toBeDefined();
    expect(result?.ui).toBeDefined();
  });

  it('resolves composite segment using parent config', () => {
    const result = resolveUIConfig('authorities:search');

    expect(result).toBeDefined();
    expect(result?.ui).toBeDefined();
  });

  it('returns undefined for non-existent segment', () => {
    const result = resolveUIConfig('nonexistent');

    expect(result).toBeUndefined();
  });

  it('returns undefined for composite segment with non-existent parent', () => {
    const result = resolveUIConfig('nonexistent:child');

    expect(result).toBeUndefined();
  });

  it('handles authorities browse segment', () => {
    const result = resolveUIConfig('authorities:browse');

    expect(result).toBeDefined();
  });

  it('handles hubs with internal segment', () => {
    const result = resolveUIConfig('hubs:local');

    expect(result).toBeDefined();
  });

  it('returns undefined for empty segment', () => {
    const result = resolveUIConfig('');

    expect(result).toBeUndefined();
  });

  it('resolves both simple and composite segments consistently', () => {
    const simpleResult = resolveUIConfig('resources');
    const compositeResult = resolveUIConfig('authorities:search');

    expect(simpleResult).toBeDefined();
    expect(compositeResult).toBeDefined();
  });
});

describe('getDefaultUISegment', () => {
  it('returns first segment key when segments exist', () => {
    const uiConfig = {
      segments: {
        search: { ui: { titleId: 'search.title' } },
        browse: { ui: { titleId: 'browse.title' } },
      },
    };

    const result = getDefaultUISegment(uiConfig as unknown as SearchTypeUIConfig);

    expect(result).toBe('search');
  });

  it('returns undefined when no segments', () => {
    const uiConfig = {
      ui: { titleId: 'test.title' },
    };

    const result = getDefaultUISegment(uiConfig as unknown as SearchTypeUIConfig);

    expect(result).toBeUndefined();
  });

  it('returns undefined when segments is empty object', () => {
    const uiConfig = {
      segments: {},
    };

    const result = getDefaultUISegment(uiConfig as unknown as SearchTypeUIConfig);

    expect(result).toBeUndefined();
  });

  it('returns first segment in insertion order', () => {
    const uiConfig = {
      segments: {
        browse: { ui: { titleId: 'browse.title' } },
        search: { ui: { titleId: 'search.title' } },
        advanced: { ui: { titleId: 'advanced.title' } },
      },
    };

    const result = getDefaultUISegment(uiConfig as unknown as SearchTypeUIConfig);

    expect(result).toBe('browse');
  });

  it('handles single segment', () => {
    const uiConfig = {
      segments: {
        only: { ui: { titleId: 'only.title' } },
      },
    };

    const result = getDefaultUISegment(uiConfig as unknown as SearchTypeUIConfig);

    expect(result).toBe('only');
  });

  it('returns undefined when segments is null', () => {
    const uiConfig = {
      segments: null,
    };

    const result = getDefaultUISegment(uiConfig as unknown as SearchTypeUIConfig);

    expect(result).toBeUndefined();
  });

  it('returns undefined when segments is undefined', () => {
    const uiConfig = {
      segments: undefined,
    };

    const result = getDefaultUISegment(uiConfig as unknown as SearchTypeUIConfig);

    expect(result).toBeUndefined();
  });
});
