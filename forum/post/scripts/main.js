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

const userOptionsButtons = document.getElementsByClassName("userSectionSVG");
for (let i = 0; i < userOptionsButtons.length; i++) {
	userOptionsButtons[i].addEventListener("click", (e) => {
		userOptionsButtons[i].classList.toggle("active");
	});
}

document.addEventListener("click", (e) => {
	for (let i = 0; i < userOptionsButtons.length; i++) {
		if (userOptionsButtons[i].classList.contains("active")){
			if (!hasAncestorClass(e.target, "userSectionOptionsContainer")) {
				userOptionsButtons[i].classList.remove("active");
			}
		}
	}
});

const inviteBtn = document.getElementById("requestInvite");
inviteBtn.addEventListener("click", (e) => {
	if (inviteBtn.className !== "active") {
		inviteBtn.className = "active";
	}
});

function isOverflown(elem) {
	return elem.scrollHeight > elem.clientHeight;
}