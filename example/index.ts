import { EditorState } from '@codemirror/state'
import { keymap, EditorView, drawSelection, rectangularSelection, highlightActiveLine } from '@codemirror/view'
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands'
import { defaultHighlightStyle, syntaxHighlighting, indentOnInput } from '@codemirror/language'
import { languages } from '@codemirror/language-data';
import { Table } from '@lezer/markdown';

import richEditor from '../src';
import config from './markdoc';
import './style.css';

// @ts-expect-error
import doc from './example.md?raw';

const state = EditorState.create({
  doc,
  extensions: [
    richEditor({
      markdoc: config,
      lezer: {
        codeLanguages: languages,
        extensions: [Table]
      }
    }),
    EditorView.lineWrapping,
    history(),
    drawSelection(),
    rectangularSelection(),
    highlightActiveLine(),
    indentOnInput(),
    syntaxHighlighting(defaultHighlightStyle),
    keymap.of([indentWithTab, ...defaultKeymap, ...historyKeymap]),
  ],
});

const parent = document.getElementById('app') as Element;
const view = new EditorView({ state, parent });