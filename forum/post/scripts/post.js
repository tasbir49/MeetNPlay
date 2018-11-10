"use strict";

const form = document.getElementById("commentForm");
const inp = document.getElementById("commentInput");
const thread = document.getElementById("thread");

const user = {
	userName : document.getElementById("navUserName").childNodes[0],
	userLocation : "Harare, Zimbabwe",
}

// Will soon properly append to DOM to avoid adding event listener again
if (form) form.addEventListener("submit", addComment);

function addComment(e) {
	e.preventDefault();

	const comment = document.createElement("section");
	comment.className = "comment curUser";

	// == == USER SECTION
	let divSection = document.createElement("div");
	divSection.className = "sectionCard userSection";

	const userImg = document.getElementById("navUserImg");
	const img = userImg.cloneNode();
	img.id = "";
	divSection.appendChild(img);

	let divSection2 = document.createElement("div");
	divSection2.className = "userSectionInfo";

	let elem = document.createElement("h4");
	elem.className = "userName";
	elem.appendChild(user.userName.cloneNode());
	divSection2.appendChild(elem);

	// -- Date
	elem = document.createElement("span");
	elem.className = "postDetailsLabel";
	elem.appendChild(document.createTextNode("Posted: "));

	let elem2 = document.createElement("i");
	const date = new Date();
	elem2.appendChild(document.createTextNode(date.toUTCString().substring(0, 16)));
	let elem3 = document.createElement("span");
	elem3.className = "time";
	elem3.appendChild(document.createTextNode(date.toUTCString().substring(16)));
	elem2.appendChild(elem3);

	elem.appendChild(elem2);
	divSection2.appendChild(elem);

	divSection.appendChild(divSection2);
	// -- /added Date

	// -- Location
	elem = document.createElement("span");
	elem.className = "postDetailsLabel";
	elem.appendChild(document.createTextNode("Location: "));

	elem2 = document.createElement("i");
	elem2.appendChild(document.createTextNode(user.userLocation));
	elem.appendChild(elem2);
	divSection2.appendChild(elem);

	divSection.appendChild(divSection2);
	// -- /added Location

	comment.appendChild(divSection);
	// == == /added USER SECTION


	// == == USER OPTIONS BUTTON
	divSection = document.createElement("div");
	divSection.className = "userSectionOptionsContainer";
	divSection2 = document.createElement("div");
	divSection2.className = "userSectionOptions";

	
	const parser = new DOMParser();
	// Need to find a framework that inserts SVGs in a better way
	let svg = parser.parseFromString('<svg class="userOptionsSVG" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 18c1.657 0 3 1.343 3 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3zm0-9c1.657 0 3 1.343 3 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3zm0-9c1.657 0 3 1.343 3 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3z"/></svg>',
		"image/svg+xml");
	
	divSection2.appendChild(svg.documentElement);

	elem = document.createElement("ul");
	elem.className = "userSectionOptionsList";
	
	// -- Edit comment button
	// elem2 = document.createElement("li");
	// elem3 = document.createElement("a");
	// elem3.className = "editComment";

	// svg = parser.parseFromString('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M7.127 22.564l-7.126 1.436 1.438-7.125 5.688 5.689zm-4.274-7.104l5.688 5.689 15.46-15.46-5.689-5.689-15.459 15.46z"/></svg>',
	// 	"image/svg+xml");
	
	// elem3.appendChild(svg.documentElement);
	// elem3.appendChild(document.createTextNode(" Edit Comment"));

	// elem2.appendChild(elem3);
	// elem.appendChild(elem2);

	// -- Delete comment button
	elem2 = document.createElement("li");
	elem3 = document.createElement("a");
	elem3.className = "delete deleteComment";
	svg = parser.parseFromString('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M3 6v18h18v-18h-18zm5 14c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4-18v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.315c0 .901.73 2 1.631 2h5.712z"/></svg>',
		"image/svg+xml");
	
	elem3.appendChild(svg.documentElement);
	elem3.appendChild(document.createTextNode(" Delete Comment"));

	elem2.appendChild(elem3);
	elem.appendChild(elem2);

	divSection2.appendChild(elem);
	divSection.appendChild(divSection2);
	comment.appendChild(divSection);
	// == == /added USER OPTIONS BUTTON


	// == == USER MESSAGE
	divSection = document.createElement("div");
	divSection.className = "userMessage";
	divSection.appendChild(document.createTextNode(inp.value));

	comment.appendChild(divSection);
	// == == /added USER MESSAGE

	thread.appendChild(comment);
}