export interface AngularComponentOptions {
  componentName?: string;
  selector?: string;
}

/**
 * Escapes content for use inside a JavaScript/TypeScript template literal (backticks).
 * Backticks and ${ must be escaped so they are not interpreted.
 */
function escapeForTemplateLiteral(content: string): string {
  return content
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$\{/g, '\\${');
}

/**
 * Generates a standalone Angular component TypeScript source from HTML and CSS.
 * Includes CUSTOM_ELEMENTS_SCHEMA for Web Components (e.g. Shoelace).
 */
export function generateAngularComponent(
  html: string,
  css: string,
  options: AngularComponentOptions = {}
): string {
  const componentName = options.componentName ?? 'GeneratedComponent';
  const selector = options.selector ?? 'app-generated';

  const templateEscaped = escapeForTemplateLiteral(html.trim());
  const stylesEscaped = escapeForTemplateLiteral(css.trim());

  return `import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: '${selector}',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: \`${templateEscaped}\`,
  styles: [\`${stylesEscaped}\`]
})
export class ${componentName} {}
`;
}
