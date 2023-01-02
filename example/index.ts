import { EditorState } from '@codemirror/state'
import { keymap, EditorView, drawSelection, rectangularSelection, highlightActiveLine } from '@codemirror/view'
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands'
import { defaultHighlightStyle, syntaxHighlighting, indentOnInput } from '@codemirror/language'
import { markdown } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { Table } from '@lezer/markdown';

import richEditor from '../src';
import './style.css';

// @ts-expect-error
import doc from './example.md?raw';

const state = EditorState.create({
  doc,
  extensions: [
    richEditor,
    EditorView.lineWrapping,
    history(),
    drawSelection(),
    rectangularSelection(),
    highlightActiveLine(),
    indentOnInput(),
    syntaxHighlighting(defaultHighlightStyle),
    markdown({ codeLanguages: languages, extensions: [Table] }),
    keymap.of([indentWithTab, ...defaultKeymap, ...historyKeymap]),
  ],
});

const parent = document.getElementById('app') as Element;
const view = new EditorView({ state, parent });