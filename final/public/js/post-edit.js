"use-strict";

const editFormInputs = document.getElementsByClassName("editFormInput");
const apiUrl = "/";

const gameInp = document.getElementById("gameTitle-edit");
const gameLabel = document.getElementById("gameTitle-editLabel");
let apiTimer;
let loadingIcon = insertLoadingIcon(gameLabel, "112px", "-1.125rem");
loadingIcon.style.display = 'none';
let prevInp = "";

const timeInp = document.getElementById("time-edit");
const dateInp = document.getElementById("date-edit");
timeInp.value = "18:00";
let nextDay = new Date();
nextDay.setDate(new Date().getDate() + 1)
dateInp.value = nextDay.getFullYear() + "-" + (nextDay.getMonth() + 1) + "-" + ("0" + nextDay.getDate()).slice(-2);


for (let i = 0; i < editFormInputs.length; i++) {
	editFormInputs[i].addEventListener("focus", (e) => {
		if (editFormInputs[i].id !== "platform-edit") {
			editFormInputs[i].parentElement.getElementsByClassName("editFormInputLabel")[0].classList.add("active");
		} else {
			editFormInputs[i].parentElement.parentElement.getElementsByClassName("editFormInputLabel")[0].classList.add("active");
			editFormInputs[i].parentElement.classList.add("active");
		}
	});
	editFormInputs[i].addEventListener("focusout", (e) => {
		if (editFormInputs[i].id !== "platform-edit") {
			editFormInputs[i].parentElement.getElementsByClassName("editFormInputLabel")[0].classList.remove("active");
		} else {
			editFormInputs[i].parentElement.parentElement.getElementsByClassName("editFormInputLabel")[0].classList.remove("active");
			editFormInputs[i].parentElement.classList.remove("active");
		}
	});
}
/**
const searchOptions = {
	"game" : ["Dota 2", "Counter-Strike: Global Offensive", "PLAYERUNKNOWN'S BATTLEGROUNDS", "Warframe", "ARK: Survival Evolved", "Team Fortress 2", "Tom Clancy's Rainbow Six Siege", "Rocket League", "Football Manager 2019", "Rust", "Grand Theft Auto V", "Total War: WARHAMMER II", "Garry's Mod", "Sid Meier's Civilization V", "Fallout 4", "Euro Truck Simulator 2", "Sid Meier's Civilization VI", "Dead by Daylight", "MONSTER HUNTER: WORLD", "Arma 3", "Paladins", "Path of Exile", "Hearts of Iron IV", "Football Manager 2018", "PAYDAY 2", "Rayman Origins"],
	"id": [0,10,20,3,4,5,6,6,7,7]
};
searchOptions.game.sort();

**/

const curGame = {
	name: "",
	id: "",
	cover: "",
	platforms: "",
	genres: ""
}
let gameInfo;
let xhttp = new XMLHttpRequest();
xhttp.open("GET", "/igdb/"+gameInp.value);
xhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		gameInfo = JSON.parse(this.response);
		addAutocomplete(gameInp);
		updatePlatforms();
	}
}
xhttp.send();

function addAutocomplete(inp) {
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
					gameInfo = JSON.parse(this.response);
					optionList = gameInfo.names;
					loadingIcon.style.display = 'none';
					if (inp === document.activeElement) {
						showAutocomplete();
					}
					updatePlatforms();
				}
			}
			xhttp.open("GET", "/igdb/"+inp.value);
			xhttp.send();
		}, 2500)
	}

	function showAutocomplete() {
		closeAutocomplete();
		const value = (!inp.value) ? "" : inp.value;

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
						curGame.platforms = gameInfo.platforms[i];
						curGame.name = itemVal;
						curGame.id = gameInfo.ids[i];
						curGame.cover = gameInfo.covers[i];
						curGame.genres = gameInfo.genres[i];

						closeAutocomplete();
						showAutocomplete();
						updatePlatforms();
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

function hasClass(element, className) {
	return (' ' + element.className + ' ').indexOf(' ' + className+ ' ') > -1;
}

const platformInput = document.getElementById("platform-edit");
let platforms;
const platformXHR = new XMLHttpRequest();
platformXHR.open("GET", "/platforms");
platformXHR.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		const res = JSON.parse(this.response);
		platforms = res.platforms;
	}
}
platformXHR.send();

let genres;
const genreXHR = new XMLHttpRequest();
genreXHR.open("GET", "/genres");
genreXHR.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		const res = JSON.parse(this.response);
		genres = res.genres;
	}
}
genreXHR.send();

function updatePlatforms() {
	if (curGame.name.toUpperCase() !== gameInp.value.toUpperCase()) {
		curGame.name = gameInp.value;
		for (let i in gameInfo.names) {
			if (gameInfo.names[i].toUpperCase() === curGame.name.toUpperCase()) {
				curGame.platforms = gameInfo.platforms[i];
				curGame.id = gameInfo.ids[i];
				curGame.cover = gameInfo.covers[i];
				curGame.genres = gameInfo.genres[i];
				break;
			}
		}
	}

	while (platformInput.lastChild) {
		platformInput.removeChild(platformInput.lastChild);
	}
	const matchedPlatforms = platforms.filter(elem => {
		if (curGame.platforms) {
			return curGame.platforms.find(e => {
				return e === elem.igdb_id;
			});
		} else {
			return false;
		}
	});

	matchedPlatforms.forEach(elem => {
		platformInput.appendChild(new Option(elem.name, elem.name));
	})
}

platformInput.addEventListener("focus", updatePlatforms);

const postForm = document.getElementById("post-edit");
let isSubmitting = false;

postForm.addEventListener("submit", e => {
	e.preventDefault();
	if (isSubmitting) return;
	isSubmitting = true;
	const submitButton = document.getElementById("post-editSubmit");
	const submitLoadingIcon = insertLoadingIcon(submitButton, "-130px", "2px", "white", "24px", "24px");

	const formData = new FormData(postForm);

	let val = formData.get("game");
	formData.delete("game");
	formData.append("gameTitle", val);

	val = formData.get("plaforms");
	if (!val) {
		formData.delete("plaforms");
	}

	const time = formData.get("postTime");
	const date = formData.get("postDate");
	formData.delete("postTime");
	formData.delete("postDate");
	val = new Date(date + " " + time + ":00")
	formData.append("date", val);
	

	const matchedGenres = genres.filter(elem => {
		if (curGame.genres) {
			return curGame.genres.find(e => {
				return e === elem.igdb_id;
			});
		} else {
			return false;
		}
	});

	if (matchedGenres.length) {
		formData.append("gameGenres", matchedGenres);
	}
	formData.append("gamePicUrl", curGame.cover);

	const data = {};

	formData.forEach((val, key) => {
		if (!val && key !== "plaforms" && key !== "keywords" && isSubmitting) {
			isSubmitting = false;
			submitButton.removeChild(submitLoadingIcon);
			document.getElementById("errorMsg").style.display = 'inline';
			const inps = document.getElementsByClassName("editFormInput");
			for (let i in inps) {
				if (inps[i].name === key || (inps[i].name === "game" && key === "gameTitle")) {
					inps[i].previousElementSibling.classList.add("required");
				}
			}
		}
		if (isSubmitting) {
			data[key] = val;
		}
	});
	if (!isSubmitting) {
		return;
	}

	let xhr = new XMLHttpRequest();
	if (!isEdit) {
		xhr.open("POST", "/api/post/create");
	} else {
		const editID = location.pathname.substr(location.pathname.lastIndexOf('/') + 1);
		xhr.open("PATCH", "/api/post/edit/" + editID);
	}
	xhr.setRequestHeader("Content-Type", "application/json");

	xhr.onreadystatechange = function() {
	    if (this.readyState === 4) {
	    	location = this.responseURL;
	    }
	}

	xhr.send(JSON.stringify(data));
})