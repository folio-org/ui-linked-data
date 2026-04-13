import { TextDecoder, TextEncoder } from 'util';

Object.assign(global, { TextDecoder, TextEncoder });

const observe = jest.fn();
const unobserve = jest.fn();
const disconnect = jest.fn();

const intersectionObserverMock = function () {
  return {
    observe,
    unobserve,
    disconnect,
  };
};

window.IntersectionObserver = intersectionObserverMock as any;
