import { lazy } from 'react';

// import.meta.env.PROD is used directly (not via an indirected constant) so that
// Vite can replace it with `true` as a text substitution BEFORE bundling.
// This allows Rolldown to eliminate the dead branch and the dynamic import entirely,
// keeping @tanstack/react-query-devtools out of the production bundle.
//
// This module must be mocked in Jest (see setupMocks) because ts-jest cannot
// compile import.meta with CommonJS output.
export const ReactQueryDevtools = import.meta.env.PROD
  ? () => null
  : lazy(() =>
      import('@tanstack/react-query-devtools').then(({ ReactQueryDevtools }) => ({
        default: ReactQueryDevtools,
      })),
    );
