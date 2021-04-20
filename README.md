# MMT Online Tools (mmteditor)

Online tools for the [MMT language and ecosystem](https://uniformal.github.io/).

See in action at <https://comfreek.github.io/mmteditor/>.

- MMT QuickEditor: Editor with syntax highlighting and abbreviation autocompletion.

  ![Screenshot of MMT QuickEditor](./img/screenshot-quickeditor.png)

- "How do I type X?": Find out how to type things you encountered.

  ![Screenshot of "How do I type X?" feature](./img/screenshot-how-do-i-type.png)

- Abbreviation Search: Find out the abbreviation whose name you only partly remember.

  ![Screenshot of "Abbreviation Search"](./img/screenshot-abbr-search.png)

- Bare Editor: A bare full-screen MMT editor within your browser (available at <https://comfreek.github.io/mmteditor/bare.html>)

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

## Development Notes

### Testing locally

1. Get an HTTP server, e.g. [*http-server* from NPM](https://www.npmjs.com/package/http-server): `npm i http-server -g`.
2. Go to <http://127.0.0.1:8080/index.html> and <http://127.0.0.1:8080/bare.html> and test things manually (type random (in)valid MMT syntax, test autocomplete).

### Updating MMT's abbreviation map

Regularly update the raw abbreviation data in `abbreviations.js` by copying everything from <https://github.com/UniFormal/MMT/blob/devel/src/mmt-api/resources/unicode/unicode-latex-map>.
Detailed instructions can be found in `abbreviations.js`.

### Updating CodeMirror

Suppose CodeMirror releases a new version X.Y.Z. Hopefully, [Renovate](https://github.com/renovatebot/renovate) already filed a pull request.
Then do:

1. Hopefully the [codemirror/CodeMirror repository on GitHub](https://github.com/codemirror/CodeMirror) contains a corresponding tag `X.Y.Z`.
2. From within this repository, `cd codemirror` and do:

   1. `git remote add upstream https://github.com/codemirror/CodeMirror.git` (if not already existing)
   2. `git remote set-url origin --push git@github.com:ComFreek/CodeMirror.git` (if not already done)
   3. `git fetch upstream --tags`
   4. `git merge X.Y.Z`
   5. `git commit -m "..."` (in case of merge conflicts) and `git push origin`

3. In case Renovate filed a pull request, do `git fetch` and `git merge origin/renovate/codemirror-x.y`.

   Confirm that in both files `index.html` and `bare.html`, the URIs referencing CodeMirror resources (`<script src="...">` and `<link href="...">`) really contain the updated version.
   If not or if Renovate did not file a pull request at all, update these versions in the URIs manually.

4. Test whether things work locally

5. `git add --all`, `git commit -m "Update CodeMirror to X.Y.Z"`, `git push`
