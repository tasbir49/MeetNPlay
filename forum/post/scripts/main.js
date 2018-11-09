"use strict";

const userMessages = document.getElementsByClassName("userMessage");

for (let i = 0; i < userMessages.length; i++) {
	if (isOverflown(userMessages[i])) {
		let overflowButton = document.createElement("div");
		overflowButton.className = "userMessageOverflowButton";
		overflowButton.addEventListener("click", (e) => {
			e.target.classList.toggle("overflow");
			e.target.previousElementSibling.classList.toggle("overflow");
		});
		userMessages[i].parentNode.appendChild(overflowButton);
	}
}

document.addEventListener("click", (e) => {
	if (e.target.classList.contains("userOptionsSVG")) {
		e.target.classList.toggle("active");
	} else if (e.target.parentNode.classList.contains("userOptionsSVG")) {
		e.target.parentNode.classList.toggle("active");
	} else {
		if (!hasAncestorClass(e.target, "userSectionOptionsContainer")) {
			const userOptionsButtons = document.getElementsByClassName("userOptionsSVG");
			for (let i = 0; i < userOptionsButtons.length; i++) {
				userOptionsButtons[i].classList.remove("active");
			}
			
		}
	}
});


// This if statement is a hacky check if user is logged in; just for phase 1.
if (document.getElementById("navUser")) {
	const inviteBtn = document.getElementById("requestInvite");
	let invited = false;
	if (inviteBtn) {
		inviteBtn.addEventListener("click", (e) => {
			if (inviteBtn.className !== "active" && !invited) {
				invited = true;

				// insertLoadingIcon defined in /scripts/main.js
				const loadingIcon = insertLoadingIcon(inviteBtn, "7px", "2px", "black");
				setTimeout(() => {
					inviteBtn.className = "active";
					inviteBtn.removeChild(loadingIcon);
				}, 2000);
			}
		});
	}
} else {
	// console.log("Go log in!");
}

function isOverflown(elem) {
	return elem.scrollHeight > elem.clientHeight;
}