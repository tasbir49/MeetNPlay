"use strict";

const userMessages = document.getElementsByClassName("userMessage");
const leaveButton = document.getElementById("requestLeave");
if(leaveButton){
    leaveButton.addEventListener("click", goToHome);
}
function goToHome(e) {
    window.location.href = "../../forum/loggedInForumUser.html"
}

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
	if (e.target.id === "deleteDialog") {
		return false;
	}
	if (e.target.classList.contains("userOptionsSVG")) {
		e.target.classList.toggle("active");
	} else if (e.target.parentNode.classList.contains("userOptionsSVG")) {
		e.target.parentNode.classList.toggle("active");
	} else if (e.target.className === "editComment") {
		// let elem = e.target.parentNode;
		// while (!elem.classList.contains("comment")) {
		// 	elem = elem.parentNode;
		// }
		// console.log(elem.getElementsByClassName("userMessage")[0].firstChild);
	} else if (e.target.classList.contains("deleteComment")) {
		e.preventDefault();
		let elem = e.target.parentNode;
		while (!elem.classList.contains("comment")) {
			elem = elem.parentNode;
		}
		deletePrompt(elem);
	}
	else {
		if (!hasAncestorClass(e.target, "userSectionOptionsContainer")) {
			const userOptionsButtons = document.getElementsByClassName("userOptionsSVG");
			for (let i = 0; i < userOptionsButtons.length; i++) {
				userOptionsButtons[i].classList.remove("active");
			}
			
		}
	}
});

function isOverflown(elem) {
	return elem.scrollHeight > elem.clientHeight;
}

function deletePrompt(elem) {
	const box = document.createElement("div");
	box.id = "deleteDialog";
	const msg = document.createElement("div");
	document.body.appendChild(box);
	box.append(msg);

	msg.id = "deleteMessage";
	msg.appendChild(document.createTextNode("Are you sure you want to remove this?"));
	
	let btn = document.createElement("button");
	btn.id = "deleteApprove";
	btn.appendChild(document.createTextNode("Yeah!"));
	msg.appendChild(btn);
	btn.addEventListener("click", () => {
		elem.parentNode.removeChild(elem);
	});

	btn = document.createElement("button");
	btn.id = "deleteCancel";
	btn.appendChild(document.createTextNode("No..."));
	msg.appendChild(btn);

	box.addEventListener("click", (e) => {
            let xmlhttp = new XMLHttpRequest();   // new HttpRequest instance 
            xmlhttp.open("DELETE", "/api/comments/" + postID +"/" + elem.id);
            xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            
            let sendObj = {}
            sendObj.content = inp.value
            xmlhttp.send(JSON.stringify(sendObj));

            xmlhttp.onreadystatechange = function() {
                if (this.status == 200) {

                } else {
                    console.log(this.status)
                }
            } 
		document.body.removeChild(box);
	});
}