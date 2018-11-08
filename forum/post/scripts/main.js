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

// const overflows = document.getElementsByClassName("userMessageOverflowButton");
// for (let i = 0; i < overflows.length; i++) {
// 	overflows[i].addEventListener("click", (e) => {
// 		e.target.classList.toggle("overflow");
// 		e.target.previousElementSibling.classList.toggle("overflow");
// 	});
// }

function isOverflown(elem) {
	return elem.scrollHeight > elem.clientHeight;
}