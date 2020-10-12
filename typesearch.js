const typeSearch = document.getElementById("typeSearch");

typeSearch.addEventListener("input", () => {
    const newTypeResults = formatTypingInfo(computeTypingInfo(typeSearch.value));

    const oldTypeResults = document.getElementById("typeResults");
    oldTypeResults.parentNode.replaceChild(newTypeResults, oldTypeResults);
});

function computeTypingInfo(str) {
	const helpItems = [];
	let lastWasTypable = false;

	for (let idx = 0; idx < str.length; idx++) {
        const codepoint = str.codePointAt(idx);
        // either tab (codepoint 9) or typable ASCII character
		if (codepoint == 9 || (codepoint >= 32 && codepoint <= 126)) {
            const text = codepoint == 9 ? "<tab>" : str[idx];
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

			const abbr = abbreviationsRev.get(str[idx]);
			if (abbr) {
				helpItems.push({kind: "abbr", abbr: abbr});
			} else {
				helpItems.push({kind: "unknown", codepoint: str[idx]});
			}
		}
	}
	return helpItems;
}

function formatTypingInfo(helpItems) {
    const formattedHelpInfo = document.createElement("ul");
    formattedHelpInfo.setAttribute("id", "typeResults")

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
            codeNode.appendChild(document.createTextNode(helpItem.codepoint));
            outerNode.appendChild(codeNode);
            outerNode.appendChild(document.createTextNode("`"));
		}
		return outerNode;
	});

	formattedHelpItems.forEach(formattedHelpInfo.appendChild.bind(formattedHelpInfo));

	return formattedHelpInfo;
}