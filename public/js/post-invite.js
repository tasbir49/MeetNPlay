"use strict";

const inviteBtn = document.getElementById("requestInvite");
const invSlots = document.getElementById("spaceAvailableSlots");
const slots = document.getElementById("memberSlots");
const space = document.getElementById("spaceAvailableNum");

const invites = inviteIDs.filter(elem => {
    return elem;
})
const members = memberIDs.filter(elem => {
    return elem;
})

const spaceAvailable = inviteBtn.value - members.length;
space.appendChild(document.createTextNode(spaceAvailable))


for (let i = 0; i < invites.length; i++) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/api/users/" + invites[i]);
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            addSlot(JSON.parse(this.response).user, invSlots);
        }
    }
    xhr.send();
}

for (let i = 0; i < members.length; i++) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/api/users/" + members[i]);
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            addSlot(JSON.parse(this.response).user, slots);
        }
    }
    xhr.send();
}

function addSlot(user, slot) {
    const divSection = document.createElement("div");
    divSection.className = "spaceAvailableSlotsImg";
    divSection.id = user._id;
    const divSection2 = document.createElement("img")
    divSection2.src = user.profilePicUrl;
    divSection2.className = "spaceAvailableSlotsImg2";
    divSection.appendChild(divSection2);
    slot.appendChild(divSection);

    const parser = new DOMParser();

    const elem = document.createElement("ul");
    elem.className = "userSectionOptionsList spaceAvailable";

    divSection2.addEventListener("click", () => {
        elem.classList.toggle("active");
    });

    // -- Delete comment button
    const elem2 = document.createElement("li");
    const elem3 = document.createElement("a");
    elem3.className = "delete removeUser";
    let svg = parser.parseFromString('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M3 6v18h18v-18h-18zm5 14c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4-18v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.315c0 .901.73 2 1.631 2h5.712z"/></svg>',
        "image/svg+xml");
    elem3.addEventListener("click", () => {
        const xhr = new XMLHttpRequest();
        const url = '/api/invitereq/' + postID + '/' + user._id;
        xhr.open("DELETE", url);
        xhr.send();
    })
    
    elem3.appendChild(svg.documentElement);
    elem3.appendChild(document.createTextNode(" Remove User"));

    elem2.appendChild(elem3);
    elem.appendChild(elem2);
    
    divSection.appendChild(elem);

    // imgContainer.addEventListener("click", () => {

    // })
}

if (inviteBtn && members.length !== 0) {
    inviteBtn.addEventListener("click", (e) => {
        
    });
}