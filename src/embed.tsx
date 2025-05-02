import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { WEB_COMPONENT_NAME } from '@common/constants/web-component';
import { resetAllStores } from './store';

class MarvaNextComponent extends HTMLElement {
  // TODO: UILD-147 - uncomment for using with Shadow DOM
  // private template: any | undefined;
  private mountElement: HTMLElement | undefined;
  private rootElement: ReactDOM.Root | undefined;

  connectedCallback() {
    // TODO: UILD-147 - uncomment for using with Shadow DOM
    // this.createTemplate();
    this.setupRoot();
    this.render();
  }

  disconnectedCallback() {
    this.rootElement?.unmount();
    resetAllStores();
  }

  // A workaround for 'forcing' the navigation to homepage
  // triggered from outside the web component.
  //
  // The routers in parent application and inside the web component
  // don't share the same history (are not aware of each other),
  // so, app<->web-component navigation doesn't seem to work in some cases.
  remount() {
    this.rootElement?.unmount();
    this.render();
  }

  // TODO: UILD-147 - create template with all styles for Shadow DOM
  /* private createTemplate() {
    const template = document.createElement('template');
    const styles = this.getAllStyles();

    template.innerHTML = `
      <style>${styles}</style>
    `;

    this.template = template;
  } */

  // TODO: UILD-147 - get all styles for Shadow DOM
  // private getAllStyles() {
  //   const filesGlob = import.meta.glob('./**/*.scss', { as: 'scss', eager: true });

  //   return Object.values(filesGlob).reduce((accum: string, current: any) => {
  //     return accum + current.default;
  //   }, '');
  // }

  // TODO: UILD-147 - this is used for setting up Shadow DOM
  /* private setupShadowRoot() {
    if (!this.template) return;

    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(this.template.content.cloneNode(true));

    const mountElement = this.createMountElement();
    shadowRoot.appendChild(mountElement);
  } */

  private setupRoot() {
    // TODO: UILD-147 - used for Shadow DOM
    // if (!this.template) return;

    const mountElement = this.createMountElement();

    this.appendChild(mountElement);

    // TODO: UILD-147 - inserts inline styles in the Shadow DOM element
    // this.appendChild(this.template.content.cloneNode(true));
  }

  private createMountElement() {
    const mountElement = document.createElement('div');
    // TODO: UILD-147 - used for Shadow DOM
    // mountElement.setAttribute('id', 'editor-root');

    mountElement.className = 'embed-container';
    this.mountElement = mountElement;

    return mountElement;
  }

  private render() {
    const routePrefix = this.getAttribute('route-prefix') as string;
    const config = this.getAttribute('config') as string | undefined;
    const deserializedConfig = config && JSON.parse(config);

    if (!this.mountElement) return;

    this.rootElement = ReactDOM.createRoot(this.mountElement);

    this.rootElement?.render(
      <React.StrictMode>
        <App routePrefix={routePrefix} config={deserializedConfig} />
      </React.StrictMode>,
    );
  }
}

if (!window.customElements.get(WEB_COMPONENT_NAME)) {
  window.customElements.define(WEB_COMPONENT_NAME, MarvaNextComponent);
}
