"use strict";

//the dialog boxes
const infoChange = document.querySelector("#infoChange");
const passChange = document.querySelector("#passChange");
const userNotFound = document.querySelector("#userNotFound");
const passChangeAdmin = document.querySelector("#passChangeAdmin");
const reportUser = document.querySelector("#reportUser");

const editButtons = document.querySelectorAll(".infoEditButton");
const passChangeButton = document.querySelector("#changePassButton");
const usrSearchForm = document.querySelector("#userSearchInput");
const passChangeButtonAdmin = document.querySelector("#changePassButtonAdmin");
const banUserButton = document.querySelector("#banUser");
const revokeAdminButton = document.querySelector("#revokeAdmin")
const reportUserButton = document.querySelector("#reportUserButton");

//event listeners

if(infoChange){
    infoChange.addEventListener("click", closeInfoPromptCallback);
}

if(passChange){
    passChange.addEventListener("click", closePassPromptCallback);
    passChange.addEventListener("submit", changePassCallback);
}

if(reportUser) {
    reportUser.addEventListener("click", closeReportUserPromptCallback);
    reportUser.addEventListener("submit", reportUserCallback);

}

if(passChangeAdmin){
    passChangeAdmin.addEventListener("click", closePassPromptAdminCallback);
    passChangeAdmin.addEventListener("submit", changePassAdminCallback);
}





if(passChangeButtonAdmin) {
    passChangeButtonAdmin.addEventListener("click", openPassPromptAdminCallback);
}


if(banUserButton) {
    banUserButton.addEventListener("click", banOrUnbanUserCallback);
}

if(revokeAdminButton) {
    revokeAdminButton.addEventListener("click", makeOrRevokeAdminCallback);
}


if(editButtons) {
    let i = 0;
    for (i = 0; i < editButtons.length; i++) {
        editButtons[i].addEventListener("click", editInfoCallback);
    }
}

if(passChangeButton) {
    passChangeButton.addEventListener("click", openPassPromptCallback);
}
if(reportUserButton) {
    reportUserButton.addEventListener("click", openReportUserCallback);
}

userNotFound.addEventListener("click", closeUserNotFoundPromptCallback);

usrSearchForm.addEventListener("submit", searchUserCallback);

//-----------------DOM--------------------------------------
//------------Functions--------------------------------------


function searchUserCallback(e) {
    e.preventDefault();

    let xmlhttp = new XMLHttpRequest();   // new HttpRequest instance
    xmlhttp.open("GET", "/users/" + document.querySelector('#userSearchQuery').value);

    xmlhttp.send()
    xmlhttp.onreadystatechange = function() {
        if (this.status == 200) {
            window.location = ("/users/" + document.querySelector('#userSearchQuery').value)

        } else {
            openUserNotFoundPromptCallback()
        }
    }
}




//user not found prompt -----------------------------
function openUserNotFoundPromptCallback(e) {
    userNotFound.style.display = "block";
}

function closeUserNotFoundPromptCallback(e) {
    userNotFound.style.display = "none";
}
//---------------------------------------------




//info prompt----------------------------------------------------
function openInfoPromptCallback(e) {

    infoChange.style.display = "block";
}
function closeInfoPromptCallback(e) {
    if(e.target.classList.contains("closeBox") || e.target.classList.contains("dialogContainer"))
    {
        cleanInfoPrompt();
    }
}

function cleanInfoPrompt() {
    infoChange.querySelector("textarea").value = "";
    infoChange.style.display = "none";
}
//-----------------------------------------------------------------


//password change prompt for user changing own ---------------------
//due to no backend, this does nothing
function openPassPromptCallback(e) {
    passChange.style.display = "block";

}

function closePassPromptCallback(e) {

     if(e.target.classList.contains("closeBox") || e.target.classList.contains("dialogContainer"))
        {
            cleanPassPrompt();
        }
}

function cleanPassPrompt() {
    let textInputs = passChange.querySelectorAll("input[type=\"text\"]");
    let i = 0;
    for(i = 0; i < textInputs.length; i++) {
        textInputs[i].value = "";
    }
    passChange.style.display = "none";
}
//-------------------------------------------------------------------

//password change prompt for admin changing pass ---------------------
//so far no backend integration so changing pass does nothing
function openPassPromptAdminCallback(e) {
    passChangeAdmin.style.display = "block";

}

function closePassPromptAdminCallback(e) {

     if(e.target.classList.contains("closeBox") || e.target.classList.contains("dialogContainer"))
        {
            cleanPassAdminPrompt();
        }
}

function cleanPassAdminPrompt() {
    let textInputs = passChangeAdmin.querySelectorAll("input[type=\"text\"]");
    let i = 0;
    for(i = 0; i < textInputs.length; i++) {
        textInputs[i].value = "";
        textInputs[i].placeholder = "Set new password"
    }
    passChangeAdmin.style.display = "none";
}
//-------------------------------------------------------------------


//report user prompt-----------------

function openReportUserCallback(e) {
    reportUser.style.display = "block";
}

function closeReportUserPromptCallback(e) {
    if(e.target.classList.contains("closeBox") || e.target.classList.contains("dialogContainer"))
        {
            cleanReportUserPrompt();
        }
}

function cleanReportUserPrompt() {
    let textInputs = reportUser.querySelectorAll("input[type=\"text\"]");
    let i = 0;
    for(i = 0; i < textInputs.length; i++) {
        textInputs[i].value = "";
    }
    reportUser.style.display = "none";
}

//-----------------------------------





//----------------------------------------------------------
//----------------------------------------------------------


//normally this would update info to the backend as well
function editInfoCallback(e) {
    infoEditSetup(e.target.parentNode);
    openInfoPromptCallback(e)
}

//function using closures to allow access to infoSection from infoEditCallback
function infoEditSetup(infoSectionNode) {

    //Function to edit fields in account page
    function infoEditCallback(e) {
        e.preventDefault();
        let newInfoContent = e.target.parentNode.querySelector("#newInfo").value
        let infoContentArea = infoSectionNode.querySelector(".userInfoSectionContent");

        let xmlhttp = new XMLHttpRequest();   // new HttpRequest instance
        xmlhttp.open("PATCH", "/api/users/changeInfo/" + document.querySelector('#userNameHeading').innerText);
        xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        let sendObj = {}
        sendObj[infoSectionNode.getAttribute("data-property")] = newInfoContent

        xmlhttp.send(JSON.stringify(sendObj));

        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                     if(infoContentArea.firstChild) {
                       infoContentArea.removeChild(infoContentArea.firstChild);
                    }
                    let newText = document.createTextNode(newInfoContent);
                    infoContentArea.appendChild(newText);

                    //dont want unnecessary listener
                    infoChange.removeEventListener("submit", infoEditCallback);
                    cleanInfoPrompt();
            } else {

                    infoChange.removeEventListener("submit", infoEditCallback);
                    cleanInfoPrompt();
            }
        }


    }

    //listener only needed for setup
    infoChange.addEventListener("submit", infoEditCallback);

}

//normally the hash is updated to db and there are checks made with old
//password
function changePassCallback(e) {
        e.preventDefault();
    let newPass = document.querySelector("#newPass").value
    let confirmPass = document.querySelector("#confirmPass").value
    if(newPass === confirmPass) {
        let xmlhttp = new XMLHttpRequest();   // new HttpRequest instance
            xmlhttp.open("PATCH", "/api/users/changePassword/" + document.querySelector('#userNameHeading').innerText);
            xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            let sendObj = {}

            sendObj.oldPassword = document.querySelector("#oldPass").value
            sendObj.password = document.querySelector("#newPass").value

            xmlhttp.send(JSON.stringify(sendObj));

            xmlhttp.onreadystatechange = function() {
                if (this.status == 200) {
                    cleanPassPrompt();
                } else {
                    document.querySelector("#newPass").value = ""
                    document.querySelector("#newPass").placeholder = "try again"
                    document.querySelector("#confirmPass").value = ""
                    document.querySelector("#confirmPass").placeholder = "try again"
                    document.querySelector("#oldPass").value = ""
                    document.querySelector("#oldPass").placeholder = this.responseText

                }
        }
    } else {
        document.querySelector("#newPass").value = ""
        document.querySelector("#newPass").placeholder = "try again"
        document.querySelector("#confirmPass").value = ""
        document.querySelector("#confirmPass").placeholder = "try again"
        document.querySelector("#oldPass").value = ""
        document.querySelector("#oldPass").placeholder = "confirm and new not same"
    }
}

//normally the hash is updated to db and there are checks made with old
//password
function changePassAdminCallback(e) {
    e.preventDefault();

    let xmlhttp = new XMLHttpRequest();   // new HttpRequest instance
    xmlhttp.open("PATCH", "/api/users/changeInfo/" + document.querySelector('#userNameHeading').innerText);
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    let sendObj = {}


    sendObj.password = document.querySelector("#newPassAdmin").value

    xmlhttp.send(JSON.stringify(sendObj));

    xmlhttp.onreadystatechange = function() {
        if (this.status == 200) {
                cleanPassAdminPrompt();


        } else {
            document.querySelector("#newPassAdmin").value = ""
            document.querySelector("#newPassAdmin").placeholder = "try again"

        }
    }

}

//adds or removes user to banned database but does nothing for now
//but change the button to say Unban
function banOrUnbanUserCallback(e) {
    let xmlhttp = new XMLHttpRequest();   // new HttpRequest instance
    xmlhttp.open("PATCH", "/api/users/changeInfo/" + document.querySelector('#userNameHeading').innerText);
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    let sendObj = {}



    let textVal = banUserButton.firstChild.nodeValue;
    let newTextNode;
    if(textVal == "Ban this user") {
        sendObj.isBanned = true
    } else {
        sendObj.isBanned = false
    }
    xmlhttp.send(JSON.stringify(sendObj));

    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            if(textVal == "Ban this user") {
                newTextNode = document.createTextNode("Unban this user");
            } else {
                newTextNode = document.createTextNode("Ban this user");
            }
                banUserButton.removeChild(banUserButton.firstChild);
            banUserButton.appendChild(newTextNode);

        }
    }
}


function makeOrRevokeAdminCallback(e) {
    let xmlhttp = new XMLHttpRequest();   // new HttpRequest instance
    xmlhttp.open("PATCH", "/api/users/changeInfo/" + document.querySelector('#userNameHeading').innerText);
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    let sendObj = {}



    let textVal = revokeAdminButton.firstChild.nodeValue;
    let newTextNode;
    if(textVal == "Revoke Admin Priveleges") {
        sendObj.isAdmin = false
    } else {
        sendObj.isAdmin = true
    }
    xmlhttp.send(JSON.stringify(sendObj));

    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            if(textVal == "Revoke Admin Priveleges") {
                newTextNode = document.createTextNode("Make This User Admin");
            } else {
                newTextNode = document.createTextNode("Revoke Admin Priveleges");
            }
            revokeAdminButton.removeChild(revokeAdminButton.firstChild);
            revokeAdminButton.appendChild(newTextNode);

        }
    }
}

//should add to report database in backend
function reportUserCallback(e) {
    e.preventDefault();
    let xmlhttp = new XMLHttpRequest();   // new HttpRequest instance
    xmlhttp.open("POST", "/reports/api/create");
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    let sendObj = {}
    sendObj.perpetrator = document.querySelector('#userNameHeading').innerText
    sendObj.content = document.querySelector('#reportUserContent').value
    xmlhttp.send(JSON.stringify(sendObj));

    xmlhttp.onreadystatechange = function() {
            cleanReportUserPrompt();

    }
}

const editProfile = document.getElementById("editProfilePicContainer");
const profilePicEditable = document.getElementById("profilePicEditableContainer");
const profilePicUpload = document.getElementById('editProfilePicButtonInput')
const profilePicSubmit = document.getElementById("editProfilePicButtonSubmit");
const profilePicOverlay = document.getElementById("profilePicOverlay");
const closeDialog = document.getElementById("editProfilePicDialogClose");
const profilePicSample = document.getElementById("editProfilePicSample");

closeDialog.addEventListener("click", e => {
    editProfile.style.display = '';
    profilePicOverlay.style.display = '';
});

editProfile.addEventListener("click", e => {
    if (e.target === editProfile) {
        editProfile.style.display = '';
        profilePicOverlay.style.display = '';
    }
})
if(profilePicEditable) {
    profilePicEditable.addEventListener("click", e => {
        editProfile.style.display = 'block';
        profilePicOverlay.style.display = 'block';
    })

    profilePicUpload.addEventListener('change', e => {
        const file = e.target.files[0];
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            document.getElementById("editProfilePicSample").style.backgroundImage = "url(" + reader.result + ")";
        }
        reader.readAsDataURL(file);

        profilePicSubmit.style.display = "inline-block";
    });

    profilePicSubmit.addEventListener("click", e => {
        const file = profilePicUpload.files[0];

        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/update-profile-pic");
        const formData = new FormData();
        formData.append("update-profile-pic", file);

        xhr.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                location.reload();
            } else if (this.readyState === 4) {
                if (!document.getElementById("editProfilePicError")) {
                    const errorText = document.createElement("span");
                    errorText.id = "editProfilePicError";
                    errorText.append(document.createTextNode("Cannot update profile picture."))
                    profilePicSample.parentElement.insertBefore(errorText, profilePicSample);
                }
            }
        }

        xhr.send(formData);

        e.preventDefault();
    });

    document.addEventListener("keydown", e => {
        if (e.key !== undefined) {
            code = e.key;
        } else if (e.keyIdentifier !== undefined) {
            code = e.keyIdentifier;
        } else if (e.keyCode !== undefined) {
            code = e.keyCode;
        }

        if (code === "Escape") {
            editProfile.style.display = '';
            profilePicOverlay.style.display = '';
        }
    });
}
