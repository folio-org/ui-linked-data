import { App } from './App';
import r2wc from '@r2wc/react-to-web-component';

customElements.define(
  'marva-next',
  r2wc(App, {
    props: {
      routePrefix: 'string',
      okapi: 'json',
    },
  }),
);
