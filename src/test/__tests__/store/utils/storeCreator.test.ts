import { create as actualCreate } from 'zustand';
import { storeResetFunctions, create, resetAllStores } from '@src/store/utils/storeCreator';

jest.mock('zustand', () => ({
  create: jest.fn(),
}));

jest.mock('zustand/middleware', () => ({
  devtools: jest.fn(store => store),
}));

describe('Store Creator Utils', () => {
  beforeEach(() => {
    storeResetFunctions.clear();
    jest.clearAllMocks();
  });

  describe('storeResetFunctions', () => {
    test('initializes as empty Set', () => {
      expect(storeResetFunctions.size).toBe(0);
    });

    test('create function adds reset function to storeResetFunctions', () => {
      const mockStore = {
        getInitialState: jest.fn().mockReturnValue({ test: 'initial' }),
        setState: jest.fn(),
      };
      (actualCreate as jest.Mock).mockReturnValue(mockStore);

      create()(() => ({ test: 'value' }));

      expect(storeResetFunctions.size).toBe(1);
    });
  });

  describe('resetAllStores', () => {
    test('calls all reset functions in storeResetFunctions', () => {
      const resetFunc1 = jest.fn();
      const resetFunc2 = jest.fn();
      storeResetFunctions.add(resetFunc1);
      storeResetFunctions.add(resetFunc2);

      resetAllStores();

      expect(resetFunc1).toHaveBeenCalledTimes(1);
      expect(resetFunc2).toHaveBeenCalledTimes(1);
    });

    test('handles empty storeResetFunctions', () => {
      expect(() => resetAllStores()).not.toThrow();
    });

    test('resets stores to their initial state', () => {
      const mockSetState = jest.fn();
      const mockInitialState = { test: 'initial' };
      const mockStore = {
        getInitialState: jest.fn().mockReturnValue(mockInitialState),
        setState: mockSetState,
      };
      (actualCreate as jest.Mock).mockReturnValue(mockStore);

      create()(() => ({ test: 'value' }));
      resetAllStores();

      expect(mockSetState).toHaveBeenCalledWith(mockInitialState, true);
    });
  });
});
