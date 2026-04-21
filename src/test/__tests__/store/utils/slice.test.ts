import { SliceState, createBaseSlice } from '@/store/utils/slice';

describe('createBaseSlice', () => {
  type KeyBasic = 'testKey';

  const keys = { basic: 'testKey' };
  const initialValue = 'initialValue';
  const set = jest.fn();
  const get = jest.fn();
  let store: any;

  beforeEach(() => {
    store = {};
  });

  describe('"set" method', () => {
    let baseSlice: SliceState<string, string, string>;
    const initialState = { [keys.basic]: initialValue };

    beforeEach(() => {
      baseSlice = createBaseSlice(keys, initialValue)(set, get, store);
    });

    test('updates state with direct value', () => {
      const newValue = 'newValue';

      baseSlice.setTestKey(newValue);

      const stateUpdater = set.mock.calls[0][0];
      const newState = stateUpdater(initialState);

      expect(newState).toEqual({ [keys.basic]: newValue });
      expect(set).toHaveBeenCalledWith(expect.any(Function), false, 'setTestKey');
    });

    test('updates state with updater function', () => {
      baseSlice.setTestKey((prevValue: string) => `${prevValue}_updated`);

      const stateUpdater = set.mock.calls[0][0];
      const newState = stateUpdater(initialState);

      expect(newState).toEqual({
        [keys.basic]: `${initialValue}_updated`,
      });
      expect(set).toHaveBeenCalledWith(expect.any(Function), false, 'setTestKey');
    });
  });

  test('"reset" method resets the state to initial value', () => {
    const baseSlice = createBaseSlice(keys, initialValue)(set, get, store);

    baseSlice.resetTestKey();
    expect(set).toHaveBeenCalledWith({ testKey: initialValue }, false, 'resetTestKey');
  });

  describe('"add" method', () => {
    const keys = { basic: 'testKey' as KeyBasic };

    test('updates the state when canAddSingleItem is true', () => {
      const initialValue = ['initialValue'];
      const baseSlice = createBaseSlice<'testKey', string[], string>(keys, initialValue, true)(set, get, store);

      baseSlice.addTestKeyItem?.('newItem');
      expect(set).toHaveBeenCalledWith(expect.any(Function), false, 'addTestKeyItem');

      const state = { testKey: ['initialValue'] };
      const updater = set.mock.calls[0][0];
      expect(updater(state)).toEqual({ testKey: ['initialValue', 'newItem'] });
    });

    test('updates the state when value is an object', () => {
      type StateEntry = Record<string, string>;
      const initialValue = { key_1: 'value_1' } as StateEntry;
      const baseSlice = createBaseSlice<KeyBasic, StateEntry, StateEntry>(keys, initialValue, true)(set, get, store);

      baseSlice.addTestKeyItem?.({ key_2: 'value_2' });
      expect(set).toHaveBeenCalledWith(expect.any(Function), false, 'addTestKeyItem');

      const state = { testKey: { key_1: 'value_1' } };
      const updater = set.mock.calls[0][0];
      expect(updater(state)).toEqual({
        testKey: { key_1: 'value_1', key_2: 'value_2' },
      });
    });

    test('updates the state when value is a Set', () => {
      const initialValue = new Set(['value_1']);
      const baseSlice = createBaseSlice<KeyBasic, Set<string>, string>(keys, initialValue, true)(set, get, store);

      baseSlice.addTestKeyItem?.('value_2');
      expect(set).toHaveBeenCalledWith(expect.any(Function), false, 'addTestKeyItem');

      const state = { testKey: new Set(['value_1']) };
      const updater = set.mock.calls[0][0];
      const updatedState = updater(state);
      expect(updatedState.testKey).toEqual(new Set(['value_1', 'value_2']));
    });
  });
});
