# MMT Online Tools (mmteditor)

Online tools for the [MMT language and ecosystem](https://uniformal.github.io/).

See in action at <https://comfreek.github.io/mmteditor/>.

## MMT QuickEditor

Editor with syntax highlighting and abbreviation autocompletion.

![Screenshot of MMT QuickEditor](./img/screenshot-quickeditor.png)

## "How do I type X?"

Find out how to type things you encountered.

![Screenshot of "How do I type X?" feature](./img/screenshot-how-do-i-type.png)

## Abbreviation Search

Find out the abbreviation whose name you only partly remember.

![Screenshot of "Abbreviation Search"](./img/screenshot-abbr-search.png)

## Bare Editor

At <https://comfreek.github.io/mmteditor/bare.html> you get a bare full-screen editor with MMT syntax highlighting.

You can also use the bare editor as a "reusable component" on external sites:
include an `<iframe src="https://comfreek.github.io/mmteditor/bare.html"></iframe>` on your site,
and then via JS call [postMessage()](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) on the [iframe's contentWindow property](https://developer.mozilla.org/en-US/docs/Web/API/HTMLIFrameElement/contentWindow) with the following event data:

```json
{
    "command": "set-content",
    "content": "the content you want the editor to display"
}
```

For example, the [SyntaxPresenterServer within the MMT API](https://github.com/UniFormal/MMT/tree/devel/src/mmt-api/src/main/info/kwarc/mmt/api/web/SyntaxPresenterServer.scala) uses the bare editor this way.