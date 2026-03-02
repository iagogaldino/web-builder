const SHOELACE_CATEGORY = 'Shoelace';

const SHOELACE_CDN_BASE = 'https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.20.1/cdn';
const SHOELACE_THEME_HREF = `${SHOELACE_CDN_BASE}/themes/light.css`;
const SHOELACE_SCRIPT_SRC = `${SHOELACE_CDN_BASE}/shoelace.js`;

const blockIcon = `<svg viewBox="0 0 24 24">
  <path fill="currentColor" d="M3 3h18v18H3V3zm2 2v14h14V5H5z"/>
</svg>`;

/**
 * Injects Shoelace theme and script into the canvas iframe so Web Components
 * run in the same document (avoids adoptedStyleSheets NotAllowedError).
 */
function injectShoelaceIntoFrame(frameDoc: Document): void {
  if (!frameDoc || frameDoc.querySelector('[data-shoelace-injected]')) return;

  const head = frameDoc.head;
  if (!head) return;

  const marker = frameDoc.createElement('meta');
  marker.setAttribute('data-shoelace-injected', 'true');
  head.appendChild(marker);

  const link = frameDoc.createElement('link');
  link.rel = 'stylesheet';
  link.href = SHOELACE_THEME_HREF;
  head.appendChild(link);

  const script = frameDoc.createElement('script');
  script.type = 'module';
  script.src = SHOELACE_SCRIPT_SRC;
  script.setAttribute('data-shoelace', SHOELACE_CDN_BASE + '/');
  script.onload = () => {
    const setBasePath = (frameDoc.defaultView as Window & { setBasePath?: (path: string) => void })?.setBasePath;
    if (typeof setBasePath === 'function') setBasePath(SHOELACE_CDN_BASE + '/');
  };
  head.appendChild(script);
}

/**
 * Plugin that adds Shoelace Web Components as blocks and injects Shoelace
 * into the canvas iframe so components render without adoptedStyleSheets errors.
 */
type FrameLoadPayload = { window?: Window };

export default function shoelaceBlocksPlugin(editor: {
  BlockManager: { add: (id: string, opts: unknown) => void };
  on: (event: string, handler: (payload: FrameLoadPayload) => void) => void;
}) {
  const bm = editor.BlockManager;

  const injectIfWindow = (payload: FrameLoadPayload) => {
    if (payload.window?.document) injectShoelaceIntoFrame(payload.window.document);
  };

  editor.on('canvas:frame:load:head', injectIfWindow);
  editor.on('canvas:frame:load', injectIfWindow);

  bm.add('shoelace-button', {
    label: 'Button',
    category: SHOELACE_CATEGORY,
    content: '<sl-button variant="primary">Button</sl-button>',
    media: blockIcon
  });

  bm.add('shoelace-input', {
    label: 'Input',
    category: SHOELACE_CATEGORY,
    content:
      '<sl-input label="Label" placeholder="Placeholder"></sl-input>',
    media: blockIcon
  });

  bm.add('shoelace-card', {
    label: 'Card',
    category: SHOELACE_CATEGORY,
    content: `<sl-card><span slot="header">Header</span><p>Content</p></sl-card>`,
    media: blockIcon
  });

  bm.add('shoelace-checkbox', {
    label: 'Checkbox',
    category: SHOELACE_CATEGORY,
    content: '<sl-checkbox>Checkbox</sl-checkbox>',
    media: blockIcon
  });

  bm.add('shoelace-switch', {
    label: 'Switch',
    category: SHOELACE_CATEGORY,
    content: '<sl-switch>Switch</sl-switch>',
    media: blockIcon
  });

  bm.add('shoelace-badge', {
    label: 'Badge',
    category: SHOELACE_CATEGORY,
    content: '<sl-badge>Badge</sl-badge>',
    media: blockIcon
  });

  bm.add('shoelace-divider', {
    label: 'Divider',
    category: SHOELACE_CATEGORY,
    content: '<sl-divider></sl-divider>',
    media: blockIcon
  });

  bm.add('shoelace-textarea', {
    label: 'Textarea',
    category: SHOELACE_CATEGORY,
    content:
      '<sl-textarea label="Label" placeholder="Placeholder"></sl-textarea>',
    media: blockIcon
  });
}
