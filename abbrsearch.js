const abbrSearch = document.getElementById("abbrSearch");
const abbrLookupResults = document.getElementById("abbrLookupResults");

abbrSearch.addEventListener("input", updateAbbreviationLookupResults.bind(null));
updateAbbreviationLookupResults();

function updateAbbreviationLookupResults() {
	// clear all previous lookup results
	//
	// might be pretty slow, see also
	// https://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript
	abbrLookupResults.innerHTML = "";


	for (const [abbrKey, abbrValue] of fuzzyFindAbbreviations(abbrSearch.value)) {
		const result = document.createElement("li");
		result.appendChild(document.createTextNode(`${abbrKey}\t${abbrValue}`));
		abbrLookupResults.appendChild(result);
	}
}

function fuzzyFindAbbreviations(str) {
	str = str.toLowerCase();

	const matches = [];

	for (const [abbrKey, abbrValue] of abbreviations.entries()) {
		if (abbrKey.toLowerCase().includes(str) || abbrValue.toLowerCase().includes(str)) {
			matches.push([abbrKey, abbrValue]);
		}
	}

	return matches;
}