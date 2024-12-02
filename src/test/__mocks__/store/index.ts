import { StoreApi } from 'zustand';

export const setInitialGlobalState = <T>(store: StoreApi<T>, initialState: any) =>
  store.setState({
    ...store.getInitialState(),
    ...initialState,
  });
