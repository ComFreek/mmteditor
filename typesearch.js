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
		if (codepoint >= 32 && codepoint <= 126) {
			if (lastWasTypable) {
				const lastHelpItem = helpItems.pop();
				lastHelpItem.text += str[idx];

				helpItems.push(lastHelpItem);
			} else {
				helpItems.push({kind: "typable", text: str[idx]});
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
		const textNode = document.createElement("code");

		if (helpItem.kind === "typable") {
			outerNode.appendChild(document.createTextNode("type `"));
            textNode.appendChild(document.createTextNode(helpItem.text));
            outerNode.appendChild(textNode);
            outerNode.appendChild(document.createTextNode("`"));
		} else if (helpItem.kind === "abbr") {
            outerNode.appendChild(document.createTextNode("use "));
            textNode.appendChild(document.createTextNode(helpItem.abbr));

            outerNode.appendChild(textNode);
		} else {
			outerNode.appendChild(document.createTextNode("copy-paste `"));
            textNode.appendChild(document.createTextNode(helpItem.codepoint));
            outerNode.appendChild(textNode);
            outerNode.appendChild(document.createTextNode("`"));
		}
		return outerNode;
	});

	formattedHelpItems.forEach(formattedHelpInfo.appendChild.bind(formattedHelpInfo));

	return formattedHelpInfo;
}