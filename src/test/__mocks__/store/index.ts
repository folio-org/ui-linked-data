import { StoreApi } from 'zustand';

export const setInitialGlobalState = <T>(store: StoreApi<T>, initialState: any) =>
  store.setState({
    ...store.getInitialState(),
    ...initialState,
  });

export const setUpdatedGlobalState = <T>(store: StoreApi<T>, updatedState: any) =>
  store.setState({
    ...store.getState(),
    ...updatedState,
  });
