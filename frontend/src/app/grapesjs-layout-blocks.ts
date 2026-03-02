const LAYOUT_CATEGORY = 'Layout';

/**
 * Plugin that adds Div and Section blocks to GrapesJS (category "Layout").
 */
export default function layoutBlocksPlugin(editor: { BlockManager: { add: (id: string, opts: unknown) => void } }) {
  const bm = editor.BlockManager;

  bm.add('layout-div', {
    label: 'Div',
    category: LAYOUT_CATEGORY,
    content: '<div data-gjs-type="default" style="min-height: 50px; padding: 10px;"></div>',
    media: `<svg viewBox="0 0 24 24">
      <path fill="currentColor" d="M3 3h18v18H3V3zm2 2v14h14V5H5z"/>
    </svg>`
  });

  bm.add('layout-section', {
    label: 'Section',
    category: LAYOUT_CATEGORY,
    content: '<section data-gjs-type="default" style="min-height: 50px; padding: 10px;"></section>',
    media: `<svg viewBox="0 0 24 24">
      <path fill="currentColor" d="M2 4h20v16H2V4zm2 2v12h16V6H4z"/>
    </svg>`
  });
}
