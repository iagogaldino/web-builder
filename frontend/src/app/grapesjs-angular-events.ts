const ANGULAR_CATEGORY = { id: 'angular', label: 'Eventos Angular', open: true };

const ANGULAR_EVENT_TRAITS = [
  { name: 'data-angular-click', label: '(click)', placeholder: 'ex: myHandler()' },
  { name: 'data-angular-dblclick', label: '(dblclick)', placeholder: 'ex: myHandler()' },
  { name: 'data-angular-keyup', label: '(keyup)', placeholder: 'ex: onKeyup($event)' },
  { name: 'data-angular-keydown', label: '(keydown)', placeholder: 'ex: onKeydown($event)' },
  { name: 'data-angular-change', label: '(change)', placeholder: 'ex: onChange($event)' },
  { name: 'data-angular-input', label: '(input)', placeholder: 'ex: onInput($event)' },
  { name: 'data-angular-submit', label: '(submit)', placeholder: 'ex: onSubmit($event)' },
  { name: 'data-angular-focus', label: '(focus)', placeholder: 'ex: onFocus()' },
  { name: 'data-angular-blur', label: '(blur)', placeholder: 'ex: onBlur()' },
  { name: 'data-angular-mouseenter', label: '(mouseenter)', placeholder: 'ex: onMouseEnter()' },
  { name: 'data-angular-mouseleave', label: '(mouseleave)', placeholder: 'ex: onMouseLeave()' },
].map((t) => ({
  type: 'text' as const,
  name: t.name,
  label: t.label,
  placeholder: t.placeholder,
  category: ANGULAR_CATEGORY,
}));

type Editor = {
  DomComponents: {
    getType: (id: string) => { model?: { defaults?: { traits?: unknown[] } } };
    addType: (id: string, def: { extend: string; model: { defaults: { traits: unknown[] } } }) => void;
  };
};

function mergeAngularTraits(baseTraits: unknown[] | undefined): unknown[] {
  const existing = Array.isArray(baseTraits) ? [...baseTraits] : baseTraits ? [baseTraits] : [];
  return [...existing, ...ANGULAR_EVENT_TRAITS];
}

/**
 * Plugin that adds "Eventos Angular" traits to the default component type and to
 * text, link, and image types. When an element is selected in the canvas, the
 * Settings panel shows the "Eventos Angular" section with (click), (change), etc.
 * Values are stored as data-angular-* attributes and converted to (event)="..."
 * in the Angular template on export.
 */
export default function angularEventsPlugin(editor: Editor) {
  const domc = editor.DomComponents;

  const typesToExtend = ['default', 'text', 'link', 'image'] as const;
  for (const typeId of typesToExtend) {
    const typeDef = domc.getType(typeId);
    const baseTraits = typeDef?.model?.defaults?.traits;
    domc.addType(typeId, {
      extend: typeId,
      model: {
        defaults: {
          traits: mergeAngularTraits(Array.isArray(baseTraits) ? baseTraits : baseTraits ? [baseTraits] : undefined),
        },
      },
    });
  }
}
