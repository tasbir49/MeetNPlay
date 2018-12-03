"use strict";

const navUser = document.getElementById("navUser");
const navUserImg = document.getElementById("navUserImg");
const navUserOptions = document.getElementById("navUserOptionsList");

navUserImg.addEventListener("click", (e) => {
	navUser.classList.toggle("active");
	navUserOptions.classList.toggle("active");
});

document.addEventListener("click", (e) => {
	if (navUser.classList.contains("active")){
		if (!hasAncestorID(e.target, "navUser")) {
			navUser.classList.remove("active");
			navUserOptions.classList.remove("active");
		}
	}
});
