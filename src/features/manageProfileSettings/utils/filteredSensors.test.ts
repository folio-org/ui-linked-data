import { FilteredKeyboardSensor, FilteredPointerSensor } from './filteredSensors';

describe('filteredSensors', () => {
  const makeTarget = (noDnd: boolean): Element => {
    const root = document.createElement('div');
    root.innerHTML =
      `<div` +
      (noDnd ? ` data-no-dnd="true"` : ``) +
      `>
      <button id="btn">button</button>
    </div>`;
    return root.firstElementChild as Element;
  };

  describe('FilteredPointerSensor', () => {
    it('returns false for clicks on a data-no-dnd element', () => {
      const target = makeTarget(true);
      const activator = FilteredPointerSensor.activators[0];

      const result = activator.handler({
        nativeEvent: { target: target },
      });

      expect(result).toBe(false);
    });

    it('returns false for clicks on the child of a data-no-dnd element', () => {
      const target = makeTarget(true);
      const activator = FilteredPointerSensor.activators[0];
      const button = target.querySelector('#btn');

      const result = activator.handler({
        nativeEvent: { target: button },
      });

      expect(result).toBe(false);
    });

    it('returns true for clicks on an element with no dataset', () => {
      const target = makeTarget(false);
      const activator = FilteredPointerSensor.activators[0];

      const result = activator.handler({
        nativeEvent: { target: target },
      });

      expect(result).toBe(true);
    });

    it('returns true for clicks on the child of an element with no dataset', () => {
      const target = makeTarget(false);
      const button = target.querySelector('#btn');
      const activator = FilteredPointerSensor.activators[0];

      const result = activator.handler({
        nativeEvent: { target: button },
      });

      expect(result).toBe(true);
    });
  });

  describe('FilteredKeyboardSensor', () => {
    it('returns false for space on a data-no-dnd element', () => {
      const target = makeTarget(true);
      const activator = FilteredKeyboardSensor.activators[0];

      const result = activator.handler({
        nativeEvent: { target: target, key: ' ' },
      });

      expect(result).toBe(false);
    });

    it('returns false for enter on a data-no-dnd element', () => {
      const target = makeTarget(true);
      const activator = FilteredKeyboardSensor.activators[0];

      const result = activator.handler({
        nativeEvent: { target: target, key: 'Enter' },
      });

      expect(result).toBe(false);
    });

    it('returns false for any other key on a data-no-dnd element', () => {
      const target = makeTarget(true);
      const activator = FilteredKeyboardSensor.activators[0];

      const result = activator.handler({
        nativeEvent: { target: target, key: 'k' },
      });

      expect(result).toBe(false);
    });

    it('returns false for space on the child of a data-no-dnd element', () => {
      const target = makeTarget(true);
      const button = target.querySelector('#btn');
      const activator = FilteredKeyboardSensor.activators[0];

      const result = activator.handler({
        nativeEvent: { target: button, key: ' ' },
      });

      expect(result).toBe(false);
    });

    it('returns false for enter on the child of a data-no-dnd element', () => {
      const target = makeTarget(true);
      const button = target.querySelector('#btn');
      const activator = FilteredKeyboardSensor.activators[0];

      const result = activator.handler({
        nativeEvent: { target: button, key: 'Enter' },
      });

      expect(result).toBe(false);
    });

    it('returns false for any other key on the child of a data-no-dnd element', () => {
      const target = makeTarget(true);
      const button = target.querySelector('#btn');
      const activator = FilteredKeyboardSensor.activators[0];

      const result = activator.handler({
        nativeEvent: { target: button, key: 'k' },
      });

      expect(result).toBe(false);
    });

    it('returns true for space on an element with no dataset', () => {
      const target = makeTarget(false);
      const activator = FilteredKeyboardSensor.activators[0];

      const result = activator.handler({
        nativeEvent: { target: target, key: ' ' },
      });

      expect(result).toBe(true);
    });

    it('returns true for enter on an element with no dataset', () => {
      const target = makeTarget(false);
      const activator = FilteredKeyboardSensor.activators[0];

      const result = activator.handler({
        nativeEvent: { target: target, key: 'Enter' },
      });

      expect(result).toBe(true);
    });

    it('returns false for any other key on an element with no dataset', () => {
      const target = makeTarget(false);
      const activator = FilteredKeyboardSensor.activators[0];

      const result = activator.handler({
        nativeEvent: { target: target, key: 'k' },
      });

      expect(result).toBe(false);
    });

    it('returns true for space on the child of an element with no dataset', () => {
      const target = makeTarget(false);
      const button = target.querySelector('#btn');
      const activator = FilteredKeyboardSensor.activators[0];

      const result = activator.handler({
        nativeEvent: { target: button, key: ' ' },
      });

      expect(result).toBe(true);
    });

    it('returns true for enter on the child of an element with no dataset', () => {
      const target = makeTarget(false);
      const button = target.querySelector('#btn');
      const activator = FilteredKeyboardSensor.activators[0];

      const result = activator.handler({
        nativeEvent: { target: button, key: 'Enter' },
      });

      expect(result).toBe(true);
    });

    it('returns false for any other key on the child of an element with no dataset', () => {
      const target = makeTarget(false);
      const button = target.querySelector('#btn');
      const activator = FilteredKeyboardSensor.activators[0];

      const result = activator.handler({
        nativeEvent: { target: button, key: 'k' },
      });

      expect(result).toBe(false);
    });
  });
});
