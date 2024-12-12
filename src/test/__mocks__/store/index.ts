import { StoreApi } from 'zustand';

type StoreState = Record<string, any>;

interface StoreWithState {
  store: StoreApi<StoreState>;
  state: StoreState;
}

interface StoreWithUpdatedState<T> {
  store: StoreApi<T>;
  updatedState: Partial<T>;
}

export const setInitialGlobalState = (storeWithStates: StoreWithState[]) => {
  storeWithStates.forEach(({ store, state }) => {
    store.setState({
      ...store.getInitialState(),
      ...state,
    });
  });
};

export const setUpdatedGlobalState = <T>(storeWithUpdatedStates: StoreWithUpdatedState<T>[]) => {
  storeWithUpdatedStates.forEach(({ store, updatedState }) => {
    store.setState({
      ...store.getState(),
      ...updatedState,
    });
  });
};
