import { createBaseSlice } from '@src/store/utils/slice';

describe('createBaseSlice', () => {
  type KeyBasic = 'testKey';
  type KeySingleItem = 'item';
  let set: jest.Mock;
  let get: jest.Mock;
  let store: any;

  beforeEach(() => {
    set = jest.fn();
    get = jest.fn();
    store = {};
  });

  test('"set" method updates the state', () => {
    const keys = { basic: 'testKey' };
    const initialValue = 'initialValue';
    const sliceTitle = 'testSlice';
    const baseSlice = createBaseSlice(keys, initialValue, sliceTitle)(set, get, store);

    baseSlice.setTestKey('newValue');
    expect(set).toHaveBeenCalledWith({ testKey: 'newValue' }, false, 'testSlice/setTestKey');
  });

  test('"reset" method resets the state to initial value', () => {
    const keys = { basic: 'testKey' };
    const initialValue = 'initialValue';
    const sliceTitle = 'testSlice';
    const baseSlice = createBaseSlice(keys, initialValue, sliceTitle)(set, get, store);

    baseSlice.resetTestKey();
    expect(set).toHaveBeenCalledWith({ testKey: initialValue }, false, 'testSlice/resetTestKey');
  });

  describe('"add" method', () => {
    const keys = { basic: 'testKey' as KeyBasic, singleItem: 'item' as KeySingleItem };

    test('updates the state when canAddSingleItem is true', () => {
      const initialValue = ['initialValue'];
      const sliceTitle = 'testSlice';
      const baseSlice = createBaseSlice<'testKey', string[], 'item', string>(
        keys,
        initialValue,
        sliceTitle,
        true,
      )(set, get, store);

      baseSlice.addItem?.('newItem');
      expect(set).toHaveBeenCalledWith(expect.any(Function), false, 'testSlice/addTestKey');

      const state = { testKey: ['initialValue'] };
      const updater = set.mock.calls[0][0];
      expect(updater(state)).toEqual({ testKey: ['initialValue', 'newItem'] });
    });

    test('updates the state when value is an object', () => {
      const initialValue = { key1: 'value1' } as Record<string, string>;
      const sliceTitle = 'testSlice';
      const baseSlice = createBaseSlice<KeyBasic, Record<string, string>, KeySingleItem, Record<string, string>>(
        keys,
        initialValue,
        sliceTitle,
        true,
      )(set, get, store);

      baseSlice.addItem?.({ key2: 'value2' });
      expect(set).toHaveBeenCalledWith(expect.any(Function), false, 'testSlice/addTestKey');

      const state = { testKey: { key1: 'value1' } };
      const updater = set.mock.calls[0][0];
      expect(updater(state)).toEqual({
        testKey: { key1: 'value1', key2: 'value2' },
      });
    });

    test('updates the state when value is a Set', () => {
      const initialValue = new Set(['value1']);
      const sliceTitle = 'testSlice';
      const baseSlice = createBaseSlice<KeyBasic, Set<string>, KeySingleItem, string>(
        keys,
        initialValue,
        sliceTitle,
        true,
      )(set, get, store);

      baseSlice.addItem?.('value2');
      expect(set).toHaveBeenCalledWith(expect.any(Function), false, 'testSlice/addTestKey');

      const state = { testKey: new Set(['value1']) };
      const updater = set.mock.calls[0][0];
      const updatedState = updater(state);
      expect(updatedState.testKey).toEqual(new Set(['value1', 'value2']));
    });
  });
});
