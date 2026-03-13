// focus-trap-react depends on tabbable, which depends on getClientRects(),
// which is not implemented in JSDom used in Jest. Always skip the display
// check when testing to avoid complaints about missing tabbable nodes.

jest.mock('tabbable', () => {
  const lib = jest.requireActual('tabbable');
  const tabbable = {
    ...lib,
   tabbable: (node, options) => lib.tabbable(node, { ...options, displayCheck: 'none' }),
   focusable: (node, options) => lib.focusable(node, { ...options, displayCheck: 'none' }),
   isFocusable: (node, options) => lib.isFocusable(node, { ...options, displayCheck: 'none' }),
   isTabbable: (node, options) => lib.isTabbable(node, { ...options, displayCheck: 'none' }),
  };
  return {
    ...tabbable,
    default: tabbable,
  }
});
