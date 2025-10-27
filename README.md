# @folio/linked-data

Copyright (C) 2024 The Open Library Foundation

This software is distributed under the terms of the Apache License, Version 2.0. See the file "[LICENSE](LICENSE)" for more information.

## Introduction
UI application designed for performing operations on a library's linked data graph. This application can run standalone outside of the FOLIO platform. The [ui-ld-folio-wrapper](https://github.com/folio-org/ui-ld-folio-wrapper) module integrates this application for use within FOLIO.

## Table of Contents

- [Installation](#installation)
- [Scripts](#scripts)
- [Usage](#usage)

## Installation

### 1. Install dependencies

via npm:

```bash
npm install
```

or Yarn:

```bash
yarn install
```

### 2. Configure the application:

Create a JSON object with required data, then use it in such cases:

- For development or using Linked data as a standalone application, in a browser's localstorage create a record with a key `okapi_config` and stringified JSON value (see "JSON config example");

- For an embedded application:
  Use JSON in the `config` attribute, see [Usage](#usage) section.

###### Configuration options:
  * `basePath`: Backend URI to which requests from the frontend are going to be directed.
  * `tenant`: Okapi tenant.
  * `token`: Okapi token.
  * `customEvents`: A dictionary with custom event names. The keys of this dictionary have to be specific while the values can be arbitrary but unique. Events are used to communicate between this application and its container when running in embedded mode.
      * `TRIGGER_MODAL`: Root application can dispatch this event to open a prompt in Linked data application which will inform a user about unsaved changes before leaving an Edit or Create page.
      * `PROCEED_NAVIGATION`: Linked data application dispatches this event when a user clicks in the prompt "Save and continue" button or closes the prompt.
      * `BLOCK_NAVIGATION`: Linked data application dispatches this event when user makes changes in a work form ("Create" or "Edit" page).
      * `UNBLOCK_NAVIGATION`: Root application can dispatch this event to allow Linked data to proceed its navigation after it's been blocked.
      * `NAVIGATE_TO_ORIGIN`: Linked data application dispatches this event when there is a need to navigate to the entrypoint from where the navigation to the Linked data application happened.
      * `DROP_NAVIGATE_TO_ORIGIN`: Linked data application dispatches this event when there is no longer a need to navigate to the entrypoint from where the navigation to the Linked data application happened. Subsequent `NAVIGATE_TO_ORIGIN` calls have no effect unless a new navigation origin is set within the root application.

###### Configuration example:

```json
{
  "basePath": "YOUR_API_URI",
  "tenant": "YOUR_TENANT",
  "token": "YOUR_TOKEN",
  "customEvents": {
    "TRIGGER_MODAL": "TRIGGER_MODAL",
    "PROCEED_NAVIGATION": "PROCEED_NAVIGATION",
    "BLOCK_NAVIGATION": "BLOCK_NAVIGATION",
    "UNBLOCK_NAVIGATION": "UNBLOCK_NAVIGATION",
    "NAVIGATE_TO_ORIGIN": "NAVIGATE_TO_ORIGIN",
    "DROP_NAVIGATE_TO_ORIGIN": "DROP_NAVIGATE_TO_ORIGIN"
  }
}
```

## Scripts

The following scripts are available:

- `npm run dev`: Starts the development server.
- `npm run build`: Generates the build artifacts that can be deployed to a production environment as a standalone application.
- `npm run build:lib`: Generates the build artifacts that can be deployed to a production environment as an embedded application.
- `npm run lint:check`: Runs ESLint on TypeScript source code, but only report errors. Does not report on style issues.
- `npm run lint:full`: Runs ESLint on TypeScript source code. Will also report on style issues.
- `typecheck`: Runs types check on source code.
- `npm run preview`: Preview a production build locally. Useful for ensuring that a production build operates as expected before deployment.
- `npm run prettier:format:all`: Formats all applicable files using Prettier.
- `npm run test:unit`: Runs unit tests using Jest.
- `npm run test:unit:watch`: Similar to `npm run test:unit`, but runs in Jest's watch mode for test-driven development.
- `npm run test:unit:coverage`: Similar to `npm run test:unit`, but also generates a code coverage report.

## Usage

### For development:

1. Run the code using `npm run dev` command.

2. Open [http://localhost:5173/](http://localhost:5173/) in a browser.

### As an embedded application:

1. Build the code as an embedded application using `npm run build:lib` command. The built code will be placed in `./dist` folder.
2. Add the script on a page:

    1. As a package in the files where you plan to use the application if it was added to your project via package management tools:
        ```js
        import '@folio/linked-data';
        ```
    2. Or as a script: 
        ```html
        <script src="[PATH_TO_SCRIPT]/linked-data.es.js"></script>
        ```


3. Add a web component in the required HTML container on the page.

   Use a config with a required API config for passing it in the Linked data application through the web component (see JSON config example in [Installation](#installation) section):

```html
<div id="linked-data-container">
  <linked-data config="{'basePath': 'YOUR_API_URI', 'tenant': 'YOUR_TENANT', ...}"></linked-data>
</div>
```

### As a standalone application:

1. Build the code as a standalone application using `npm run build` command. The built code will be placed in `./dist` folder.
2. Deploy the built code or run it using a web server.
