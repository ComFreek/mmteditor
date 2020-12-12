const Pos = CodeMirror.Pos;

function findMatchingAbbreviations(str, cursorLine, tokenEndCh) {
	console.log(str);
	str = str.toLowerCase();

	const matches = [];

	for (const [abbrKey, abbrValue] of abbreviations.entries()) {
		const caseInsensitiveAbbrKey = abbrKey.toLowerCase();

		for (let i = 0; i < abbrKey.length; i++) {
			if (str.endsWith(caseInsensitiveAbbrKey.slice(0, i + 1))) {
				matches.push({
					text: abbrValue,
					displayText: `${abbrValue}\t\t${abbrKey}`,
					from: Pos(cursorLine, tokenEndCh - (i + 1)),
					to: Pos(cursorLine, tokenEndCh)
				});
			}
		}
	}

	return matches;
}

/**
 * Initialize the MMT editor into a <textarea>
 * 
 * Also, an even listener for "message" events will be set up that processes
 * messages `{"command": "set-content", "content": "..."}` by setting the editor's contents
 * to `"..."`.
 * 
 * @param {HTMLTextAreaElement} textarea The <textarea> DOM element into which to create the CodeMirror editor.
 */
export function init(textarea) {
    CodeMirror.registerHelper("hint", "mmt", function(editor, options) {
    	// Find the token at the cursor
    	let cur = editor.getCursor();
    	console.log(cur);
    	let token = editor.getTokenAt(cur);

    	const matchingAbbreviations = findMatchingAbbreviations(token.string, cur.line, token.end);
    	return {
		    list: matchingAbbreviations,
		    from: Pos(cur.line, token.start),
		    to: Pos(cur.line, token.end)
	    };
    });

    const editor = CodeMirror.fromTextArea(textarea, {
	    mode: "mmt",
	    lineNumbers: true,
        extraKeys: {"Ctrl-Space": "autocomplete"}
    });
    editor.setSize("100%", "100%");
    editor.setOption("theme", "dracula");

    window.addEventListener("message", event => {
        const data = JSON.parse(event.data);
        if (data["command"] == "set-content") {
            editor.setValue(data["content"]);
        }
    }, false);
}