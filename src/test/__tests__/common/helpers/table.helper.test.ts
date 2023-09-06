import { swapRowPositions } from '@common/helpers/table.helper';

const toSwap = {
  a: {
    position: 0,
  },
  b: {
    position: 1,
  },
};

describe('table.helper', () => {
  describe('formatResult', () => {
    test('returns swapped data', () => {
      const swapped = swapRowPositions(toSwap, 'a', 'b');

      expect(swapped).toEqual({
        a: {
          position: 1,
        },
        b: {
          position: 0,
        },
      });
    });
  });
});
