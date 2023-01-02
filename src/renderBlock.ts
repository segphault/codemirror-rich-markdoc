import { Decoration, WidgetType, EditorView } from '@codemirror/view';
import { RangeSet, StateField } from '@codemirror/state';
import { syntaxTree } from '@codemirror/language';

import markdoc from '@markdoc/markdoc';

import type { DecorationSet } from '@codemirror/view'
import type { EditorState, Range } from '@codemirror/state';

class RenderBlockWidget extends WidgetType {
  rendered: string;

  constructor(public source: string) {
    super();

    const document = markdoc.parse(source);
    const transformed = markdoc.transform(document);
    this.rendered = markdoc.renderers.html(transformed);
  }

  eq(widget: RenderBlockWidget): boolean {
    return widget.source === widget.source;
  }

  toDOM(): HTMLElement {
    let content = document.createElement('div');
    content.setAttribute('contenteditable', 'false');
    content.className = 'cm-markdoc-renderBlock';
    content.innerHTML = this.rendered;
    return content;
  }

  ignoreEvent(): boolean {
    return false;
  }
}

function replaceBlocks(state: EditorState, from?: number, to?: number) {
  const deocrations: Range<Decoration>[] = [];
  const [cursor] = state.selection.ranges;

  syntaxTree(state).iterate({
    from, to,
    enter(node) {
      if (!['Table', 'Blockquote'].includes(node.name))
        return;

      if (cursor.from >= node.from && cursor.to <= node.to)
        return false;

      const text = state.doc.sliceString(node.from, node.to);
      const decoration = Decoration.replace({
        widget: new RenderBlockWidget(text),
        block: true,
      });

      deocrations.push(decoration.range(node.from, node.to));
    }
  });

  return deocrations;
}

export default StateField.define<DecorationSet>({
  create(state) {
    return RangeSet.of(replaceBlocks(state));
  },

  update(decorations, transaction) {
    return RangeSet.of(replaceBlocks(transaction.state));
  },

  provide(field) {
    return EditorView.decorations.from(field);
  },
});