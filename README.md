# Rich Markdown for CodeMirror 6

[Demo](https://markdoc-hybrid-editor.netlify.app)

This is a plugin for CodeMirror 6 that adds a hybrid rich-text editing mode for Markdown content. It applies rich-text styling to Markdown content and hides the Markdown formatting syntax. It only shows the formatting characters for the specific element around the position of the text cursor.

The plugin takes advantage of the [lezer-markdown](https://github.com/lezer-parser/markdown) tokenizer that comes with CodeMirror's [Markdown language support](https://github.com/codemirror/lang-markdown). For standard Markdown elements like headings, lists, links, fenced code blocks, and inline formatting spans the plugin relies on CodeMirror highlighting rules to apply rich formatting and wraps a `cm-markdoc-hidden` class around the Markdown syntax characters that should be hidden from the user.

For more complex structural elements like tables, blockquotes, and [Markdoc tags](http://markdoc.dev/docs/tags), the plugin replaces the entire content region with a CodeMirror block widget that displays rendered HTML markup. It uses Markdoc to perform the rendering. When the user moves the text cursor into one of the rendered blocks, the widget disappears and the original source text is revealed for editing.

When you add the plugin to a CodeMirror `EditorState`, you can optionally pass in a [Markdoc config object](https://markdoc.dev/docs/config) with custom tag and node definitions. You can refer to the [provided example](example/index.ts) to see basic usage. The plugin also relies on some [specific CSS styling](example/style.css) in order to properly display the rich content. The CSS classes introduced by the plugin are prefixed with `.cm-markdoc-`.

This plugin is inspired by [HyperMD](https://github.com/laobubu/HyperMD), a CodeMirror 5 rich Markdown plugin that is no longer actively maintained. This plugin is written from scratch and does not use any existing HyperMD code, but it aims to bring similar functionality to CodeMirror 6.

## Known Issues

* It is still missing proper support for Markdown image syntax
* Text surrounded by brackets (`[foo]`) is erroneously rendered as though it is a link
* In ATX-style headers, the renderer always assumes there is one space between the header mark and the header text instead of computing the actual amount of whitespace
* When using the up and down arrow keys to navigate into a region that is replaced with a rendered block, the editor sometimes moves the cursor to the opposite end of the region
* The rendered block replacement code is not yet optimized, so it recomputes all of the replaced regions on every operation instead of only updating them as needed
* Clicking inside of rendered blocks causes the cursor to be placed at the equivalent position in the document, which may not match the position of the rendered content
* Nested Markdoc tags do not yet render correctly