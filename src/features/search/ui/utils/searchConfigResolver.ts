import { type SearchTypeConfig, getSearchCoreConfig, resolveCoreConfig } from '../../core';
import { resolveUIConfig } from '../config';
import type { SearchTypeUIConfig } from '../types';

export interface ResolveSearchConfigsParams {
  currentSegment: string;
  currentSource: string | undefined;
  segments?: string[];
  defaultSegment?: string;
  staticCoreConfig?: SearchTypeConfig;
  staticUIConfig?: SearchTypeUIConfig;
}

export interface ResolvedSearchConfigs {
  coreConfig: SearchTypeConfig;
  activeUIConfig: SearchTypeUIConfig;
  baseUIConfig: SearchTypeUIConfig;
}

interface CoreConfigResolverParams {
  currentSegment: string;
  currentSource: string | undefined;
  staticCoreConfig?: SearchTypeConfig;
  segments?: string[];
  defaultSegment?: string;
}

interface UIConfigResolverParams {
  currentSegment: string;
  staticUIConfig?: SearchTypeUIConfig;
  segments?: string[];
  defaultSegment?: string;
}

interface BaseUIConfigResolverParams {
  currentSegment: string;
  staticUIConfig?: SearchTypeUIConfig;
  activeUIConfig: SearchTypeUIConfig;
}

/**
 * Resolve the core configuration for the given segment and source.
 * Returns the static core config if provided, otherwise resolves from registry.
 */
function resolveCoreConfigForSegment({
  currentSegment,
  currentSource,
  staticCoreConfig,
  segments,
  defaultSegment,
}: CoreConfigResolverParams): SearchTypeConfig {
  // Static mode: use provided config
  if (staticCoreConfig) {
    return staticCoreConfig;
  }

  // Dynamic mode: resolve using centralized resolver
  const config = resolveCoreConfig(currentSegment, currentSource);
  if (config) return config;

  // Fallback to defaultSegment or first segment's config
  const fallbackSegment = defaultSegment ?? segments?.[0];
  if (!fallbackSegment) {
    throw new Error(`No config found for segment: ${currentSegment}`);
  }

  const fallbackCoreConfig = getSearchCoreConfig(fallbackSegment);
  if (!fallbackCoreConfig) {
    throw new Error(`No config found for segment: ${fallbackSegment}`);
  }

  return fallbackCoreConfig;
}

/**
 * Resolve the active UI configuration for the given segment.
 * Returns the static UI config if provided, otherwise resolves from registry.
 */
function resolveActiveUIConfigForSegment({
  currentSegment,
  staticUIConfig,
  segments,
  defaultSegment,
}: UIConfigResolverParams): SearchTypeUIConfig {
  // Static mode: use provided UI config
  if (staticUIConfig) {
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

  const fallbackUIConfig = resolveUIConfig(fallbackSegment);
  if (!fallbackUIConfig) {
    throw new Error(`No UI config found for segment: ${fallbackSegment}`);
  }

  return fallbackUIConfig;
}

/**
 * Resolve the base UI configuration (parent segment's config for shared features).
 * In dynamic mode, extracts the parent segment if current segment is composite (e.g., "authorities:search" -> "authorities").
 */
function resolveBaseUIConfig({
  currentSegment,
  staticUIConfig,
  activeUIConfig,
}: BaseUIConfigResolverParams): SearchTypeUIConfig {
  // Static mode: use provided UI config
  if (staticUIConfig) {
    return staticUIConfig;
  }

  // For dynamic mode, resolve the parent UI config
  const parentSegment = currentSegment.includes(':') ? currentSegment.split(':')[0] : currentSegment;
  const uiConfig = resolveUIConfig(parentSegment);

  return uiConfig ?? activeUIConfig;
}

/**
 * Resolve search configs based on current segment and source.
 * Supports both static mode (explicit configs) and dynamic mode (registry lookup).
 */
export function resolveSearchConfigs({
  currentSegment,
  currentSource,
  segments,
  defaultSegment,
  staticCoreConfig,
  staticUIConfig,
}: ResolveSearchConfigsParams): ResolvedSearchConfigs {
  const coreConfig = resolveCoreConfigForSegment({
    currentSegment,
    currentSource,
    staticCoreConfig,
    segments,
    defaultSegment,
  });

  const activeUIConfig = resolveActiveUIConfigForSegment({
    currentSegment,
    staticUIConfig,
    segments,
    defaultSegment,
  });

  const baseUIConfig = resolveBaseUIConfig({
    currentSegment,
    staticUIConfig,
    activeUIConfig,
  });

  return { coreConfig, activeUIConfig, baseUIConfig };
}
