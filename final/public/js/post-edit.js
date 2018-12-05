"use-strict";

const editFormInputs = document.getElementsByClassName("editFormInput");

for (let i = 0; i < editFormInputs.length; i++) {
	editFormInputs[i].addEventListener("focus", (e) => {
		e.target.parentNode.getElementsByClassName("editFormInputLabel")[0].classList.add("active");
	});
	editFormInputs[i].addEventListener("focusout", (e) => {
		e.target.parentNode.getElementsByClassName("editFormInputLabel")[0].classList.remove("active");
	});
}


const searchOptions = {
	"game" : searchOptionsNameId
};

const gameInp = document.getElementById("gameTitle-edit");
addAutocomplete(gameInp);


function addAutocomplete(inp) {
	//make this call into api?
	//call first 10 that matches the input?
	const optionList = searchOptions[inp.name];
	optionsList = 
	console.log(optionList);
	if (!optionList) {
		return;
	}

	let curItem;

	inp.addEventListener("input", showAutocomplete);
	inp.addEventListener("focus", showAutocomplete);
	inp.addEventListener("keydown", selectAutocompleteItem);
	inp.addEventListener("submit", () => {
		e.preventDefault();
	});
	document.addEventListener("click", closeAutocomplete);

	function showAutocomplete() {
		closeAutocomplete();
		const value = (!inp.value) ? "" : inp.value;

		curItem = -1;

		const itemsContainer = document.createElement("div");
		itemsContainer.id = inp.name + "_autocompleteList";
		itemsContainer.className = "autocompleteList";

		inp.parentElement.appendChild(itemsContainer);
		//optionlist.name
		for (let i = 0; i < optionList.length; i++) {
			let match = optionList[i].substring(0, value.length);
			if (match.toUpperCase() === value.toUpperCase()) {
				const item = document.createElement("div");
				item.className = "autocompleteItem";

				let textNode = document.createTextNode(match);
				let elem = document.createElement("strong");
				elem.appendChild(textNode);
				item.appendChild(elem);
				//textnode.data_id = optionList.name
				textNode = document.createTextNode(optionList[i].substring(value.length));
				item.appendChild(textNode);

				// Hidden tag to hold item value
				elem = document.createElement("input");
				elem.type = "hidden";
				elem.value = optionList[i];
				item.appendChild(elem);

				item.addEventListener("click", () => {
					inp.focus();
					const itemVal = item.getElementsByTagName("input")[0].value;
					inp.value = itemVal;

					closeAutocomplete();
					showAutocomplete();
				});

				itemsContainer.appendChild(item);
			}
		}
	}

	function selectAutocompleteItem(e) {
		// Tab key
		if (e.keyCode == 9) {
			closeAutocomplete(e);
			return;
		}
		const itemsContainer = document.getElementById(inp.name + "_autocompleteList");
		if (!itemsContainer) {
			return
		}

		const items = itemsContainer.getElementsByClassName("autocompleteItem");

		// Down key
		if (e.keyCode == 40) {
			curItem++;
			highlightAutocompleteItem(items);
		}
		// Up key
		else if (e.keyCode == 38) {
			curItem--;
			highlightAutocompleteItem(items);
		}
		// Enter key
		else if (e.keyCode == 13) {
			if (curItem > -1) {
				if (items) {
					items[curItem].click();
				}
				e.preventDefault();
			}
		}
	}

	function highlightAutocompleteItem(items) {
		if (!items) {
			return;
		}

		const prevHighlight = document.getElementById("autocompleteItem-active");
		if (prevHighlight) {
			prevHighlight.id = "";
		}

		if (curItem >= items.length) {
			curItem = 0;
		} else if (curItem < 0) {
			curItem = (items.length - 1);
		}

		items[curItem].id = "autocompleteItem-active";
	}

	// This is used as an event listener and can be used manually by another function.
	function closeAutocomplete(e) {
		if (!e) {
			const elem = document.getElementById(inp.name + "_autocompleteList");
			if (elem){
				inp.parentElement.removeChild(elem);
			}
		}
		else if (e.target != inp && !hasClass(e.target, "autocompleteItem") || e.keyCode == 9) {
			const elem = document.getElementById(inp.name + "_autocompleteList");
			if (elem){
				inp.parentElement.removeChild(elem);
			}
			if (hasClass(inp, "autocomplete_multiple")) {
				inp.value = "";
			}
		}
	}
}

function removeFromArray(arr, value) {
	for(let i = 0; i < arr.length; i++) {
		if (arr[i] === value) {
			arr.splice(i, 1);
		}
	}
}

function hasClass(element, className) {
	return (' ' + element.className + ' ').indexOf(' ' + className+ ' ') > -1;
}
