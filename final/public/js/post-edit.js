"use-strict";

const editFormInputs = document.getElementsByClassName("editFormInput");
const apiUrl = "/";

const gameLabel = document.getElementById("gameTitle-editLabel");
let apiTimer;
let loadingIcon = insertLoadingIcon(gameLabel, "102px", "-1.125rem");
loadingIcon.style.display = 'none';
let prevInp = "";


for (let i = 0; i < editFormInputs.length; i++) {
	editFormInputs[i].addEventListener("focus", (e) => {
		e.target.parentNode.getElementsByClassName("editFormInputLabel")[0].classList.add("active");
	});
	editFormInputs[i].addEventListener("focusout", (e) => {
		e.target.parentNode.getElementsByClassName("editFormInputLabel")[0].classList.remove("active");
	});
}
/**
const searchOptions = {
	"game" : ["Dota 2", "Counter-Strike: Global Offensive", "PLAYERUNKNOWN'S BATTLEGROUNDS", "Warframe", "ARK: Survival Evolved", "Team Fortress 2", "Tom Clancy's Rainbow Six Siege", "Rocket League", "Football Manager 2019", "Rust", "Grand Theft Auto V", "Total War: WARHAMMER II", "Garry's Mod", "Sid Meier's Civilization V", "Fallout 4", "Euro Truck Simulator 2", "Sid Meier's Civilization VI", "Dead by Daylight", "MONSTER HUNTER: WORLD", "Arma 3", "Paladins", "Path of Exile", "Hearts of Iron IV", "Football Manager 2018", "PAYDAY 2", "Rayman Origins"],
	"id": [0,10,20,3,4,5,6,6,7,7]
};
searchOptions.game.sort();

**/

let gameInfo;
let xhttp = new XMLHttpRequest();
xhttp.open("GET", "/igdb/");
xhttp.send();
xhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		gameInfo = JSON.parse(this.response);
		const gameInp = document.getElementById("gameTitle-edit");
		addAutocomplete(gameInp);
	}
}

function addAutocomplete(inp) {
	let optionListInfo = gameInfo;
	let optionList  = "";
	if (gameInfo !=null){
		optionList = gameInfo.names;
	}

	if (!optionList) {
		return;
	}

	let curItem;

	inp.addEventListener("input", triggerAutocomplete);
	inp.addEventListener("focus", showAutocomplete);
	inp.addEventListener("keydown", selectAutocompleteItem);
	inp.addEventListener("submit", () => {
		e.preventDefault();
	});
	document.addEventListener("click", closeAutocomplete);

	function triggerAutocomplete() {
		showAutocomplete();
		clearTimeout(apiTimer);

		loadingIcon.style.display = 'block';
		
		apiTimer = setTimeout(() => {
			xhttp.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					console.log("Show new");
					optionListInfo = JSON.parse(this.response);
					optionList = optionListInfo.names;
					loadingIcon.style.display = 'none';
					showAutocomplete();
				}
			}
			xhttp.open("GET", "/igdb/"+inp.value);
			xhttp.send();
		}, 2500)
	}

	function showAutocomplete() {
		closeAutocomplete();
		const value = (!inp.value) ? "" : inp.value;
		// console.log(gameInfo.names)
		// if (inp.value == ""){
		// 	optionList = gameInfo.names;
		// } else if(prevInp != inp.value && timerDone==1){
		// 	console.log("Timer done")
		// 	timerDone = 0;
		// 	prevInp = inp.value;
		// 	xhttp.onreadystatechange = function() {
		// 		if (this.readyState == 4 && this.status == 200) {
		// 			optionListInfo = JSON.parse(this.response);
		// 			optionList = optionListInfo.names;
		// 			resetTimer();
		// 		}
		// 	}
		// 	xhttp.open("GET", "/igdb/"+inp.value);
		// 	xhttp.send();
		// }
		curItem = -1;

		const itemsContainer = document.createElement("div");
		itemsContainer.id = inp.name + "_autocompleteList";
		itemsContainer.className = "autocompleteList";

		inp.parentElement.appendChild(itemsContainer);

		for (let i = 0; i < optionList.length; i++) {
			let option = optionList[i];
			for (let j = 0; j < option.length - value.length + 1; j++) {
				let match = option.substring(j, value.length + j);
				if (match.toUpperCase() === value.toUpperCase()) {
					const item = document.createElement("div");
					item.className = "autocompleteItem";

					let textNode = document.createTextNode(option.substring(0, j));
					item.appendChild(textNode);

					textNode = document.createTextNode(match);
					let elem = document.createElement("strong");
					elem.appendChild(textNode);
					item.appendChild(elem);

					textNode = document.createTextNode(option.substring(value.length + j, option.length));
					item.appendChild(textNode);

					// Hidden tag to hold item value
					elem = document.createElement("input");
					elem.type = "hidden";
					elem.value = option;
					item.appendChild(elem);

					item.addEventListener("click", () => {
						inp.focus();
						const itemVal = item.getElementsByTagName("input")[0].value;
						inp.value = itemVal;

						closeAutocomplete();
						showAutocomplete();
					});

					itemsContainer.appendChild(item);
					break;
				}
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
