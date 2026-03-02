import { generateAngularComponent } from './angular-code-generator';

const COMMAND_EXPORT_ANGULAR = 'export-angular';
const PREFIX = 'gjs-';

/** Converts data-angular-<event>="value" attributes to Angular template syntax (event)="value". */
function dataAngularAttrsToTemplate(html: string): string {
  return html.replace(
    /\s+data-angular-([a-z]+)=(["'])([^"']*)\2/gi,
    (_, event, _quote, value) => ` (${event})="${value.replace(/"/g, '&quot;')}"`
  );
}

type Editor = {
  getHtml: (opts?: unknown) => string;
  getCss: (opts?: unknown) => string | undefined;
  Modal: { open: (opts: { title: string; content: string | HTMLElement }) => void; close: () => void };
  CodeManager?: { createViewer: (opts: { codeName?: string; theme?: string; readOnly?: boolean }) => { setContent: (c: string) => void; refresh: () => void; getElement: () => HTMLElement } };
  Commands: { add: (id: string, cmd: { run?: (editor: Editor) => void; stop?: (editor: Editor) => void }) => void };
  Panels: { addButton: (panelId: string, button: { id: string; command?: string; label: string; attributes?: Record<string, string> }) => unknown };
  getConfig: () => { stylePrefix?: string };
};

function buildModalContent(editor: Editor, html: string, css: string, tsCode: string): HTMLElement {
  const pfx = editor.getConfig?.()?.stylePrefix ?? PREFIX;
  const container = document.createElement('div');
  container.className = `${pfx}export-angular-container`;

  const tabLabels = ['HTML', 'CSS', 'Angular'];
  const tabContents = [html, css ?? '', tsCode];

  const tabButtons = document.createElement('div');
  tabButtons.className = `${pfx}export-angular-tabs`;
  tabButtons.style.cssText = 'display:flex; gap:4px; margin-bottom:8px; border-bottom:1px solid rgba(0,0,0,.2); padding-bottom:6px;';

  const contentArea = document.createElement('div');
  contentArea.className = `${pfx}export-angular-content`;
  contentArea.style.cssText = 'min-height:280px; max-height:60vh; overflow:auto;';

  const panels: HTMLElement[] = [];

  if (editor.CodeManager?.createViewer) {
    const viewerOpts = { theme: 'hopscotch', readOnly: true };
    const htmlViewer = editor.CodeManager.createViewer({ ...viewerOpts, codeName: 'htmlmixed' });
    htmlViewer.setContent(tabContents[0]);
    htmlViewer.refresh();
    const htmlPanel = document.createElement('div');
    htmlPanel.appendChild(htmlViewer.getElement());
    panels.push(htmlPanel);

    const cssViewer = editor.CodeManager.createViewer({ ...viewerOpts, codeName: 'css' });
    cssViewer.setContent(tabContents[1]);
    cssViewer.refresh();
    const cssPanel = document.createElement('div');
    cssPanel.style.display = 'none';
    cssPanel.appendChild(cssViewer.getElement());
    panels.push(cssPanel);
  } else {
    tabContents.slice(0, 2).forEach((content, i) => {
      const panel = document.createElement('pre');
      panel.style.cssText = 'margin:0; padding:10px; font-size:12px; overflow:auto; white-space:pre;';
      panel.textContent = content;
      if (i === 1) (panel as HTMLElement).style.display = 'none';
      panels.push(panel);
    });
  }

  const tsPanel = document.createElement('pre');
  tsPanel.style.cssText = 'margin:0; padding:10px; font-size:12px; overflow:auto; white-space:pre;';
  tsPanel.textContent = tabContents[2];
  tsPanel.style.display = 'none';
  panels.push(tsPanel);

  function showTab(index: number) {
    panels.forEach((panel, i) => {
      (panel as HTMLElement).style.display = i === index ? 'block' : 'none';
    });
    tabButtons.querySelectorAll('button').forEach((btn, i) => {
      (btn as HTMLButtonElement).style.fontWeight = i === index ? 'bold' : 'normal';
    });
  }

  tabLabels.forEach((label, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = label;
    btn.className = `${pfx}btn-prim`;
    btn.style.cssText = 'padding:6px 12px; cursor:pointer; border:none; border-radius:2px;';
    if (i === 0) btn.style.fontWeight = 'bold';
    btn.onclick = () => showTab(i);
    tabButtons.appendChild(btn);
  });

  panels.forEach((p) => contentArea.appendChild(p));
  container.appendChild(tabButtons);
  container.appendChild(contentArea);

  return container;
}

function openCodeModal(editor: Editor, title: string) {
  const html = editor.getHtml?.() ?? '';
  const css = editor.getCss?.() ?? '';
  const htmlForAngular = dataAngularAttrsToTemplate(html);
  const tsCode = generateAngularComponent(htmlForAngular, css);
  const content = buildModalContent(editor, html, css, tsCode);
  editor.Modal.open({ title, content });
}

const EXPORT_TEMPLATE_ID = 'export-template';

/**
 * Plugin that adds "Export Angular" and overrides "View code" (export-template)
 * so both show HTML, CSS, and generated Angular component TypeScript.
 */
export default function exportAngularPlugin(editor: Editor) {
  editor.Commands.add(EXPORT_TEMPLATE_ID, {
    run() {
      openCodeModal(editor, 'Code');
    },
    stop() {
      editor.Modal.close();
    }
  });

  editor.Commands.add(COMMAND_EXPORT_ANGULAR, {
    run() {
      openCodeModal(editor, 'Export Angular');
    },
    stop() {
      editor.Modal.close();
    }
  });

  editor.Panels.addButton('options', {
    id: COMMAND_EXPORT_ANGULAR,
    command: COMMAND_EXPORT_ANGULAR,
    label: `<svg style="display: block; max-width:22px" viewBox="0 0 24 24">
      <path fill="currentColor" d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M10.92,12.31C10.68,11.54 10.15,9.08 11.55,9.04C12.95,9 12.03,12.16 12.03,12.16C12.42,13.65 14.05,14.72 14.05,14.72C14.55,14.57 17.4,14.24 17,15.72C16.57,17.2 13.5,15.81 13.5,15.81C11.55,15.95 10.09,16.47 10.09,16.47C8.96,18.58 7.64,19.5 7.1,18.61C6.43,17.5 9.23,16.07 9.23,16.07C10.68,13.72 10.9,12.35 10.92,12.31Z"/>
    </svg>`,
    attributes: { title: 'Export Angular' }
  });
}
