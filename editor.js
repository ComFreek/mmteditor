import { abbreviationsMap as abbreviations } from "./abbreviations.js";

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
	// Register MMT autocompletion
    CodeMirror.registerHelper("hint", "mmt", function(editor, options) {
    	// Find the token at the cursor
    	const cur = editor.getCursor();
    	const token = editor.getTokenAt(cur);

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
	
	// Make autocompletion to be invoked on keyup (and not just after Ctr-Space)
	//
	// Source: <https://stackoverflow.com/a/33021864>
	// Author: Sasha <https://stackoverflow.com/users/543591/sasha>
	// License: CC BY-SA 3.0 <https://creativecommons.org/licenses/by-sa/3.0/>
	editor.on("keyup", (cm, event) => {
		if (!cm.state.completionActive && /*Enables keyboard navigation in autocomplete list*/
			event.keyCode != 13) {        /*Enter - do not open autocomplete list just after item has been selected in it*/ 
			cm.showHint({completeSingle: false});
        }
    });

    window.addEventListener("message", event => {
        const data = JSON.parse(event.data);
        if (data["command"] == "set-content") {
            editor.setValue(data["content"]);
        }
    }, false);
}