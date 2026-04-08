export function extractNestedData(response: unknown, key?: string): unknown {
  if (!key) {
    return response;
  }

  if (typeof response === 'object' && response !== null && key in response) {
    return (response as Record<string, unknown>)[key];
  }

  return response;
}
