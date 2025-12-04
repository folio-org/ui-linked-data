import { useMemo } from 'react';
import { getSearchConfig, type SearchTypeConfig } from '../../core';
import { resolveUIConfig } from '../config';
import type { SearchTypeUIConfig } from '../types';

interface UseSearchConfigsParams {
  currentSegment: string;
  currentSource: string | undefined;
  segments?: string[];
  defaultSegment?: string;
  staticConfig?: SearchTypeConfig;
  staticUIConfig?: SearchTypeUIConfig;
}

interface UseSearchConfigsResult {
  coreConfig: SearchTypeConfig;
  activeUIConfig: SearchTypeUIConfig;
  baseUIConfig: SearchTypeUIConfig;
}

/**
 * Hook to resolve search configs based on current segment and source.
 * Supports both static mode (explicit configs) and dynamic mode (registry lookup).
 */
export function useSearchConfigs({
  currentSegment,
  currentSource,
  segments,
  defaultSegment,
  staticConfig,
  staticUIConfig,
}: UseSearchConfigsParams): UseSearchConfigsResult {
  const isDynamicMode = Boolean(segments?.length);

  // Resolve active core config
  const coreConfig = useMemo(() => {
    if (!isDynamicMode && staticConfig) {
      return staticConfig;
    }

    // Dynamic mode: resolve from registry
    // Try segment + source first, then just segment
    if (currentSource) {
      const withSource = getSearchConfig(`${currentSegment}:${currentSource}`);

      if (withSource) return withSource;
    }

    const config = getSearchConfig(currentSegment);

    if (config) return config;

    // Fallback to defaultSegment or first segment's config
    const fallbackSegment = defaultSegment ?? segments?.[0];

    if (!fallbackSegment) {
      throw new Error(`No config found for segment: ${currentSegment}`);
    }

    const fallbackConfig = getSearchConfig(fallbackSegment);

    if (!fallbackConfig) {
      throw new Error(`No config found for segment: ${fallbackSegment}`);
    }

    return fallbackConfig;
  }, [isDynamicMode, staticConfig, currentSegment, currentSource, segments, defaultSegment]);

  // Resolve active UI config
  const activeUIConfig = useMemo(() => {
    if (!isDynamicMode && staticUIConfig) {
      return staticUIConfig;
    }

    // Dynamic mode: resolve from UI registry
    const uiConfig = resolveUIConfig(currentSegment);

    if (uiConfig) return uiConfig;

    // Fallback to defaultSegment or first segment's UI config
    const fallbackSegment = defaultSegment ?? segments?.[0];

    if (!fallbackSegment) {
      throw new Error(`No UI config found for segment: ${currentSegment}`);
    }

    const fallbackConfig = resolveUIConfig(fallbackSegment);

    if (!fallbackConfig) {
      throw new Error(`No UI config found for segment: ${fallbackSegment}`);
    }

    return fallbackConfig;
  }, [isDynamicMode, staticUIConfig, currentSegment, segments, defaultSegment]);

  // Base UI config (parent segment's config for shared features)
  const baseUIConfig = useMemo(() => {
    if (!isDynamicMode && staticUIConfig) {
      return staticUIConfig;
    }

    // For dynamic mode, resolve the parent UI config
    const parentSegment = currentSegment.includes(':') ? currentSegment.split(':')[0] : currentSegment;
    const uiConfig = resolveUIConfig(parentSegment);

    return uiConfig ?? activeUIConfig;
  }, [isDynamicMode, staticUIConfig, currentSegment, activeUIConfig]);

  return { coreConfig, activeUIConfig, baseUIConfig };
}
