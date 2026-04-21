import * as CoreRegistry from '../../core/config/searchRegistry';
import type { SearchTypeConfig } from '../../core/types';
import * as UIRegistry from '../config/resolveUIConfig';
import type { SearchTypeUIConfig } from '../types';
import * as GetActiveConfig from '../utils/getActiveConfig.helper';
import { resolveSearchConfigs } from './searchConfigResolver';

jest.mock('../../core/config/searchRegistry');
jest.mock('../config/resolveUIConfig');
jest.mock('../utils/getActiveConfig.helper');

describe('searchConfigResolver', () => {
  const mockCoreConfig: SearchTypeConfig = {
    id: 'test-core',
    defaults: { searchBy: 'title' },
  };

  const mockUIConfig: SearchTypeUIConfig = {
    searchableIndices: [{ value: 'title', labelId: 'Title' }],
  };

  describe('static mode', () => {
    it('uses provided static core and UI configs', () => {
      const result = resolveSearchConfigs({
        currentSegment: 'test-segment',
        currentSource: undefined,
        staticCoreConfig: mockCoreConfig,
        staticUIConfig: mockUIConfig,
      });

      expect(result.coreConfig).toBe(mockCoreConfig);
      expect(result.activeUIConfig).toBe(mockUIConfig);
      expect(result.baseUIConfig).toBe(mockUIConfig);
      expect(CoreRegistry.resolveCoreConfig).not.toHaveBeenCalled();
      expect(UIRegistry.resolveUIConfig).not.toHaveBeenCalled();
    });
  });

  describe('dynamic mode - core config resolution', () => {
    it('resolves core config from registry for simple segment', () => {
      (CoreRegistry.resolveCoreConfig as jest.Mock).mockReturnValue(mockCoreConfig);
      (UIRegistry.resolveUIConfig as jest.Mock).mockReturnValue(mockUIConfig);
      (GetActiveConfig.getActiveConfig as jest.Mock).mockReturnValue(mockUIConfig);

      const result = resolveSearchConfigs({
        currentSegment: 'resources',
        currentSource: undefined,
        segments: ['resources'],
      });

      expect(CoreRegistry.resolveCoreConfig).toHaveBeenCalledWith('resources', undefined);
      expect(result.coreConfig).toBe(mockCoreConfig);
    });

    it('resolves core config with source parameter', () => {
      (CoreRegistry.resolveCoreConfig as jest.Mock).mockReturnValue(mockCoreConfig);
      (UIRegistry.resolveUIConfig as jest.Mock).mockReturnValue(mockUIConfig);
      (GetActiveConfig.getActiveConfig as jest.Mock).mockReturnValue(mockUIConfig);

      resolveSearchConfigs({
        currentSegment: 'hubs',
        currentSource: 'external',
        segments: ['hubs'],
      });

      expect(CoreRegistry.resolveCoreConfig).toHaveBeenCalledWith('hubs', 'external');
    });

    it('falls back to defaultSegment when core config not found', () => {
      (CoreRegistry.resolveCoreConfig as jest.Mock).mockReturnValue(undefined);
      (CoreRegistry.getSearchCoreConfig as jest.Mock).mockReturnValue(mockCoreConfig);
      (UIRegistry.resolveUIConfig as jest.Mock).mockReturnValue(mockUIConfig);
      (GetActiveConfig.getActiveConfig as jest.Mock).mockReturnValue(mockUIConfig);

      const result = resolveSearchConfigs({
        currentSegment: 'unknown',
        currentSource: undefined,
        segments: ['resources', 'authorities'],
        defaultSegment: 'resources',
      });

      expect(CoreRegistry.getSearchCoreConfig).toHaveBeenCalledWith('resources');
      expect(result.coreConfig).toBe(mockCoreConfig);
    });

    it('falls back to first segment when no defaultSegment provided', () => {
      (CoreRegistry.resolveCoreConfig as jest.Mock).mockReturnValue(undefined);
      (CoreRegistry.getSearchCoreConfig as jest.Mock).mockReturnValue(mockCoreConfig);
      (UIRegistry.resolveUIConfig as jest.Mock).mockReturnValue(mockUIConfig);
      (GetActiveConfig.getActiveConfig as jest.Mock).mockReturnValue(mockUIConfig);

      resolveSearchConfigs({
        currentSegment: 'unknown',
        currentSource: undefined,
        segments: ['authorities', 'resources'],
      });

      expect(CoreRegistry.getSearchCoreConfig).toHaveBeenCalledWith('authorities');
    });

    it('throws error when no config found and no fallback available', () => {
      (CoreRegistry.resolveCoreConfig as jest.Mock).mockReturnValue(undefined);
      (UIRegistry.resolveUIConfig as jest.Mock).mockReturnValue(mockUIConfig);
      (GetActiveConfig.getActiveConfig as jest.Mock).mockReturnValue(mockUIConfig);

      expect(() =>
        resolveSearchConfigs({
          currentSegment: 'unknown',
          currentSource: undefined,
        }),
      ).toThrow('No config found for segment: unknown');
    });
  });

  describe('dynamic mode - UI config resolution', () => {
    it('resolves UI config from registry', () => {
      (CoreRegistry.resolveCoreConfig as jest.Mock).mockReturnValue(mockCoreConfig);
      (UIRegistry.resolveUIConfig as jest.Mock).mockReturnValue(mockUIConfig);
      (GetActiveConfig.getActiveConfig as jest.Mock).mockReturnValue(mockUIConfig);

      const result = resolveSearchConfigs({
        currentSegment: 'authorities',
        currentSource: undefined,
        segments: ['authorities'],
      });

      expect(UIRegistry.resolveUIConfig).toHaveBeenCalledWith('authorities');
      expect(result.activeUIConfig).toBe(mockUIConfig);
    });

    it('falls back to defaultSegment for UI config when not found', () => {
      (CoreRegistry.resolveCoreConfig as jest.Mock).mockReturnValue(mockCoreConfig);
      (CoreRegistry.getSearchCoreConfig as jest.Mock).mockReturnValue(mockCoreConfig);
      (UIRegistry.resolveUIConfig as jest.Mock).mockReturnValueOnce(undefined).mockReturnValueOnce(mockUIConfig);
      (GetActiveConfig.getActiveConfig as jest.Mock).mockReturnValue(mockUIConfig);

      resolveSearchConfigs({
        currentSegment: 'unknown',
        currentSource: undefined,
        segments: ['authorities'],
        defaultSegment: 'authorities',
      });

      expect(UIRegistry.resolveUIConfig).toHaveBeenCalledWith('unknown');
      expect(UIRegistry.resolveUIConfig).toHaveBeenCalledWith('authorities');
    });
  });

  describe('base UI config resolution', () => {
    it('returns static UI config in static mode', () => {
      const result = resolveSearchConfigs({
        currentSegment: 'test',
        currentSource: undefined,
        staticCoreConfig: mockCoreConfig,
        staticUIConfig: mockUIConfig,
      });

      expect(result.baseUIConfig).toBe(mockUIConfig);
    });

    it('uses activeUIConfig as baseUIConfig when parent config not found', () => {
      (CoreRegistry.resolveCoreConfig as jest.Mock).mockReturnValue(mockCoreConfig);
      (UIRegistry.resolveUIConfig as jest.Mock).mockReturnValueOnce(mockUIConfig).mockReturnValueOnce(undefined);
      (GetActiveConfig.getActiveConfig as jest.Mock).mockReturnValue(mockUIConfig);

      const result = resolveSearchConfigs({
        currentSegment: 'authorities:search',
        currentSource: undefined,
        segments: ['authorities:search'],
      });

      expect(result.baseUIConfig).toBe(mockUIConfig);
    });

    it('uses activeUIConfig for non-composite segments', () => {
      (CoreRegistry.resolveCoreConfig as jest.Mock).mockReturnValue(mockCoreConfig);
      (UIRegistry.resolveUIConfig as jest.Mock).mockReturnValue(mockUIConfig);
      (GetActiveConfig.getActiveConfig as jest.Mock).mockReturnValue(mockUIConfig);

      const result = resolveSearchConfigs({
        currentSegment: 'resources',
        currentSource: undefined,
        segments: ['resources'],
      });

      expect(result.baseUIConfig).toBe(mockUIConfig);
    });
  });
});
