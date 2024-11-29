import { StoreApi } from 'zustand';

export const setInitialState = <T>(store: StoreApi<T>, initialState: any) =>
  store.setState({
    ...store.getInitialState(),
    ...initialState,
  });
