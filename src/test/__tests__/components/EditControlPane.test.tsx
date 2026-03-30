import { setInitialGlobalState } from '@/test/__mocks__/store';

import { RouterProvider, createMemoryRouter } from 'react-router';

import { render } from '@testing-library/react';

import { PROFILE_BFIDS } from '@/common/constants/bibframe.constants';
import { ROUTES } from '@/common/constants/routes.constants';
import { EditControlPane } from '@/components/EditControlPane';

import { useUIStore } from '@/store';

const renderWrapper = (customState?: Parameters<typeof setInitialGlobalState>[0]) => {
  const path = ROUTES.RESOURCE_EDIT.uri;

  const defaultState = [
    {
      store: useUIStore,
      state: { currentlyEditedEntityBfid: new Set([PROFILE_BFIDS.INSTANCE]) },
    },
  ];

  setInitialGlobalState(customState || defaultState);

  return render(
    <RouterProvider
      router={createMemoryRouter(
        [
          {
            path,
            element: <EditControlPane />,
          },
        ],
        { initialEntries: [path] },
      )}
    />,
  );
};

describe('EditControlPane', () => {
  test('renders close button', () => {
    const { getByTestId } = renderWrapper();

    expect(getByTestId('nav-close-button')).toBeInTheDocument();
  });

  test('renders heading', () => {
    const { container } = renderWrapper();

    expect(container.querySelector('.heading')).toBeInTheDocument();
  });
});
