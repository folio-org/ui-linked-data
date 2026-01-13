import baseApi from '@/common/api/base.api';
import { SEARCH_API_ENDPOINT } from '@/common/constants/api.constants';
import { buildHubLocalCheckQuery, extractOriginalIds } from '../utils';

interface LocalHubCheckResponse {
  content?: Array<{
    id?: string;
    originalId?: string;
  }>;
}

/**
 * Service for checking hub availability in the local system
 */
export const hubLocalCheckService = {
  async checkLocalAvailability(tokens: string[]): Promise<Set<string>> {
    if (!tokens || tokens.length === 0) {
      return new Set<string>();
    }

    const query = buildHubLocalCheckQuery(tokens);

    const response = (await baseApi.getJson({
      url: `${SEARCH_API_ENDPOINT.HUBS_LOCAL}?query=${encodeURIComponent(query)}`,
    })) as LocalHubCheckResponse;

    return extractOriginalIds(response.content);
  },
};
