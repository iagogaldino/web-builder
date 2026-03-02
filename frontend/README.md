# Frontend

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.1.0.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Adding another Web Components library

The editor uses **Shoelace** as a Web Components design system. To install and use **another** Web Components library (e.g. Material Web, Vaadin), follow these steps.

### 1. Install the package

From the frontend directory:

```bash
npm install nome-da-lib
```

### 2. Load theme and script

- **Theme:** In `angular.json`, under `projects.frontend.architect.build.options.styles`, add the library’s theme CSS (e.g. from `node_modules/nome-da-lib/dist/...`).
- **Script:** If the library registers custom elements via a script, add it in `angular.json` under `projects.frontend.architect.build.options.scripts`.

### 3. Base path (if required)

If the library needs a base path for icons or assets (like Shoelace), call the provided setter in `main.ts` before bootstrap, e.g.:

```ts
import { setBasePath } from 'nome-da-lib/...';
setBasePath('https://cdn.../');  // or local path
```

### 4. Angular and custom elements

The app already uses `CUSTOM_ELEMENTS_SCHEMA` in the root component, so any custom element registered by the new library can be used in templates without extra Angular declarations.

### 5. Using components inside the GrapesJS canvas

The canvas runs in an **iframe**. To avoid `adoptedStyleSheets` errors and to have components render correctly:

- Load the library’s **theme and script inside the iframe document**, not only in the host.
- In a plugin (e.g. like `grapesjs-shoelace-blocks.ts`), listen for `canvas:frame:load:head` and `canvas:frame:load`, then inject into the frame’s document:
  - A `<link rel="stylesheet" href="...">` for the theme.
  - A `<script src="...">` (or dynamic import) that registers the custom elements.

### 6. Blocks in the editor (optional)

To drag-and-drop the new library’s components in the block panel:

- Create a plugin that uses `editor.BlockManager.add(...)` with a **new category** (e.g. `"Material"`, `"Vaadin"`).
- Each block’s `content` should be the HTML of the custom element (e.g. `<meu-button>Label</meu-button>`).
- In the same plugin, inject the library’s theme and script into the canvas iframe (see step 5).

Register the plugin in `main.ts` (on `window`) and add its id to `extraPlugins` in the editor component.

### Summary

| Step | Action |
|------|--------|
| 1 | `npm install nome-da-lib` |
| 2 | Add theme and script in `angular.json` (styles / scripts) |
| 3 | Set base path in `main.ts` if the library requires it |
| 4 | Rely on existing `CUSTOM_ELEMENTS_SCHEMA` in the app |
| 5 | Inject theme + script **inside the canvas iframe** to avoid `adoptedStyleSheets` errors |
| 6 | (Optional) Add a block plugin with a new category and iframe injection |

The critical part for a second Web Components lib is **step 5**: load it **inside the canvas iframe** so components render correctly in the editor.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
