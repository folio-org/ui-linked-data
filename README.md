# @folio/linked-data

This project is a new Linked data editor.

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

### 2. Provide API config:

#### a) For an external API:

Create a JSON object with required data, then use it in such cases:

- For development or using Linked data as a standalone application, in a browser's localstorage create a record with a key `okapi_config` and stringified JSON value (see "JSON config example");

- For an embedded application:
  Use JSON in the `config` attribute, see [Usage](#usage) section.

###### JSON config example:

```json
{
  "basePath": "YOUR_API_URI",
  "tenant": "YOUR_TENANT",
  "token": "YOUR_TOKEN",
  // For embedded application only. Events also should be dispatched or listened in the root application.
  "customEvents": {
    "TRIGGER_MODAL": "triggermodal", // Root application can dispatch this event to open a prompt in Linked data which will inform a user about unsaved changes before leaving an Edit or Create page.
    "PROCEED_NAVIGATION": "proceednavigation", // Linked data dispatches this event when a user clicks in the prompt "Save and continue" button or closes the prompt.
    "BLOCK_NAVIGATION": "blocknavigation" // Linked data dispatches this event when user makes changes in a work form ("Create" or "Edit" page).
  }
}
```

#### b) For an opened API (e.g. locally started. Can be used for development purposes):

1. Rename `.env` file to `.env.local`.

2. In that file change `EDITOR_API_BASE_PATH` variable's value.

## Scripts

The following scripts are available:

- `npm run dev`: Starts the development server.
- `npm run build`: Generates the build artifacts that can be deployed to a production environment as a standalone application.
- `npm run build:lib`: Generates the build artifacts that can be deployed to a production environment as an embedded application.
- `npm run lint:errors-only`: Runs ESLint on TypeScript source code, but only report errors. Does not report on style issues.
- `npm run lint:full`: Runs ESLint on TypeScript source code. Will also report on style issues.
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
