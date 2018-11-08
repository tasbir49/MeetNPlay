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
function hasAncestorClass(elem, elemClass) {
	if (elem.tagName === "HTML") {
		return elem.classList.contains(elemClass);
	} else if (elem.classList.contains(elemClass)) {
		return true;
	} else {
		return hasAncestorClass(elem.parentElement, elemClass);
	}
}

const nav = {
	"topNav" : document.getElementById("topNav"),
	"topNav_title" : document.getElementById("topNav_title"),
	"topNav_titleImg" : document.getElementById("topNav_titleImg"),
	"topNav_links" : document.getElementById("topNav_links"),
	"topNav_hamburger" : document.getElementById("topNav_hamburger"),
	"loginButton" : document.getElementById("loginButton")
}

window.onscroll = () => {
	const greater = val => {
		return window.pageYOffset > val || 
		document.body.scrollTop > val || 
		document.documentElement.scrollTop > val;
	};
	if (greater(75)) {
		nav["topNav"].style.paddingTop = "1rem";
		nav["topNav"].style.paddingBottom = "1rem";
		nav["topNav"].style.backgroundColor = "rgba(31, 35, 41, 1)";
		nav["topNav"].style.boxShadow = "0 3px 7px 1px rgba(0,0,0,1)";
		nav["topNav_titleImg"].style.height = "30px";
		nav["topNav_links"].style.marginLeft = "5em";
		nav["topNav_hamburger"].style.top = "20px";
		nav["loginButton"].style.marginTop = "1rem";
	} else {
		nav["topNav"].style.paddingTop = "2rem";
		nav["topNav"].style.paddingBottom = "2rem";
		nav["topNav"].style.backgroundColor = "rgba(31, 35, 41, 0)";
		nav["topNav"].style.boxShadow = "0 3px 7px 1px rgba(0,0,0,0)";
		nav["topNav_titleImg"].style.height = "4.5em";
		nav["topNav_links"].style.marginLeft = "7.5em";
		nav["loginButton"].style.marginTop = "2rem";
		nav["topNav_hamburger"].style.top = "2rem";
	}
};