import { ViewPlugin } from '@codemirror/view';
import { syntaxHighlighting } from '@codemirror/language';

import highlightStyle from './highlightStyle';
import RichEditPlugin from './richEdit';
import renderBlock from './renderBlock';

export default ViewPlugin.fromClass(RichEditPlugin, {
  decorations: v => v.decorations,
  provide: v => [
    renderBlock,
    syntaxHighlighting(highlightStyle)
  ],
  eventHandlers: {
    mousedown({ target }, view) {
      if (target instanceof Element && target.matches('.cm-markdoc-renderBlock *'))
        view.dispatch({ selection: { anchor: view.posAtDOM(target) } });
    }
  }
});