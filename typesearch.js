import { abbreviationsRevMap } from "./abbreviations.js";

export function init(searchElement, resultsElementID) {
	searchElement.addEventListener("input", () => {
    	const newTypeResults = formatTypingInfo(computeTypingInfo(
			typeSearch.value,
			abbreviationsRevMap
		), resultsElementID);

    	const oldTypeResults = document.getElementById(resultsElementID);
	    oldTypeResults.parentNode.replaceChild(newTypeResults, oldTypeResults);
	});
}

/**
 * Compute information on how a human would type a string using their keyboard
 * and a possible map of abbreviations.
 * 
 * @param {string} str The string
 * @param {Map<String,String>} abbreviationsRev
 *      A "reverse" map of `Unicode character |-> abbreviation to type for the user`.
 * 
 * @returns {Array<{kind: "typable"|"abbr"|"unknown", text?: string, abbr?: string, character?: string}}
 *    An array of so-called help items encoding how humans can progressively type `str`.
 *    Help items of kind "typable" have their `text` property set to the text that humans
 *    can usually just type on their keyboard. Help items of kind "abbr" have their
 *    `abbr` proprety set to the abbreviation as found in `abbreviationsRev`.
 *    Help items of kind "unknown" account for all other characters that can neither be
 *    typed on (usual) keyboards nor have been found in the abbreviation map. Those
 *    have their `character` property set to a single Unicode character.
 */
function computeTypingInfo(str, abbreviationsRev) {
	const helpItems = [];
	let lastWasTypable = false;

    // go through all Unicode (!) characters of the string
	for (const character of str.match(/./ug)) {
        const firstCodepoint = character.codePointAt(0);

        // case of typable ASCII characters:
        // either tab (codepoint 9) or non-whitespace ASCII character
        if (character.length == 1 &&
            (firstCodepoint == 9 || (firstCodepoint >= 32 && firstCodepoint <= 126))) {
            const text = firstCodepoint == 9 ? "<tab>" : character;
			if (lastWasTypable) {
				const lastHelpItem = helpItems.pop();
				lastHelpItem.text += text;

				helpItems.push(lastHelpItem);
			} else {
				helpItems.push({kind: "typable", text});
			}
            lastWasTypable = true;
		} else {
            lastWasTypable = false;

			const abbr = abbreviationsRev.get(character);
			if (abbr) {
				helpItems.push({kind: "abbr", abbr: abbr});
			} else {
				helpItems.push({kind: "unknown", character: character});
            }
		}
    }
    
    return helpItems;
}

/**
 * Format help items of `computeTypingInfo()` to an HTML <ul id="idOfElement"">...</ul> element.
 * @param helpItems See return type of `computeTypingInfo()`.
 * @param idOfElement ID to give the resulting <ul> element.
 * 
 * @returns An HTML <ul> DOM element to be appended somewhere.
 */
function formatTypingInfo(helpItems, idOfElement) {
    const formattedHelpInfo = document.createElement("ul");
    formattedHelpInfo.setAttribute("id", idOfElement)

	const formattedHelpItems = helpItems.map(helpItem => {
		const outerNode = document.createElement("li");
        const codeNode = document.createElement("code");

        codeNode.setAttribute("style", "white-space: pre");

		if (helpItem.kind === "typable") {
			outerNode.appendChild(document.createTextNode("type `"));
            codeNode.appendChild(document.createTextNode(helpItem.text));
            outerNode.appendChild(codeNode);
            outerNode.appendChild(document.createTextNode("`"));
		} else if (helpItem.kind === "abbr") {
            outerNode.appendChild(document.createTextNode("use "));
            codeNode.appendChild(document.createTextNode(helpItem.abbr));

            outerNode.appendChild(codeNode);
		} else {
			outerNode.appendChild(document.createTextNode("copy-paste `"));
            codeNode.appendChild(document.createTextNode(helpItem.character));
            outerNode.appendChild(codeNode);
            outerNode.appendChild(document.createTextNode("`"));
		}
		return outerNode;
	});

	formattedHelpItems.forEach(formattedHelpInfo.appendChild.bind(formattedHelpInfo));

	return formattedHelpInfo;
}