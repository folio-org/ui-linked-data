import { FC, ReactNode, Suspense, lazy } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const ReactQueryDevtools = import.meta.env.PROD
  ? () => null
  : lazy(() =>
      import('@tanstack/react-query-devtools').then(({ ReactQueryDevtools }) => ({
        default: ReactQueryDevtools,
      })),
    );

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

interface QueryProviderProps {
  children: ReactNode;
}

export const QueryProvider: FC<QueryProviderProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Suspense>
        <ReactQueryDevtools initialIsOpen={false} />
      </Suspense>
    </QueryClientProvider>
  );
};
