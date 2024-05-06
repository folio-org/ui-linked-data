const observe = jest.fn();
const unobserve = jest.fn();
const disconnect = jest.fn();

const intersectionObserverMock = function () {
  return {
    observe,
    unobserve,
    disconnect,
  }
}

window.IntersectionObserver = intersectionObserverMock as any;
