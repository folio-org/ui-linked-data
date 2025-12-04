import { SearchTypeConfig, SearchStrategies } from '../types';

export function selectStrategies(config: SearchTypeConfig): SearchStrategies | undefined {
  return config.strategies;
}
