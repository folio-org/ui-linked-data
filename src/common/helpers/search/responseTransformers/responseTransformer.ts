export type TransformSearchResponseParams = {
  result: Record<string, unknown>;
  resultsContainer?: string;
  limit: number;
  apiType?: 'standard' | 'hub';
};

export const transformSearchResponse = ({
  result,
  resultsContainer,
  limit,
  apiType = 'standard',
}: TransformSearchResponseParams) => {
  if (apiType === 'hub') {
    // Transform Hub API response to standard format
    const hubResult = result as { hits?: unknown[]; count?: number };

    return {
      content: hubResult.hits || [],
      totalRecords: hubResult.count || 0,
      totalPages: Math.ceil((hubResult.count || 0) / limit),
      prev: undefined,
      next: undefined,
    };
  }

  // Standard FOLIO API response
  const standardResult = result as {
    content?: unknown[];
    totalRecords?: number;
    totalPages?: number;
    prev?: string;
    next?: string;
    [key: string]: unknown;
  };

  return {
    content: standardResult.content ?? (resultsContainer ? (standardResult[resultsContainer] as unknown[]) : []) ?? [],
    totalRecords: standardResult.totalRecords ?? 0,
    totalPages: standardResult.totalPages ?? Math.ceil((standardResult.totalRecords ?? 0) / limit),
    prev: standardResult.prev,
    next: standardResult.next,
  };
};
