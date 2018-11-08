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

const userOptionsButton = document.getElementsByClassName("userSectionSVG");
for (let i = 0; i < userOptionsButton.length; i++) {
	userOptionsButton[i].addEventListener("click", (e) => {
		userOptionsButton[i].classList.toggle("active");
	});
}

function isOverflown(elem) {
	return elem.scrollHeight > elem.clientHeight;
}