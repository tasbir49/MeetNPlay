"use strict";

const hamburgerMenu = document.getElementById("topNav_hamburger");
hamburgerMenu.addEventListener("click", (e) => {
	hamburgerMenu.classList.toggle("active");
});

// This listener is for when user clicks off nav bar opened by hamburger menu.
document.addEventListener("click", (e) => {
	if (hamburgerMenu.classList.contains("active")) {
		if (!hasAncestorID(e.target, "topNav") || e.target.id === "topNav") {
			hamburgerMenu.classList.remove("active");
		}
	}
});

function hasAncestorID(elem, id) {
	if (elem.tagName === "HTML") {
		return elem.id === id;
	} else if (elem.id === id) {
		return true;
	} else {
		return hasAncestorID(elem.parentElement, id);
	}
}