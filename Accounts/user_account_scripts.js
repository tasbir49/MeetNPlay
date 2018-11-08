
//normally these doms would be filled with info loaded from
//a server. For the front end we hardcoded everything in the html
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

//normally this function would search a database of users in back end /
//and redirect to the found user's page
//but for front end, itll just not find anything
function searchUserCallback(e) {
    e.preventDefault();
    openUserNotFoundPromptCallback(e);
    
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





function changeBanButton() {
    let textVal = banUserButton.firstChild.nodeValue;
    banUserButton.removeChild(banUserButton.firstChild);
    let newTextNode;
    if(textVal == "Ban this user") {
        newTextNode = document.createTextNode("Unban this user");
    } else {
        newTextNode = document.createTextNode("Ban this user");
    }
    banUserButton.appendChild(newTextNode);
}


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
       console.log(this);
       let newInfoContent = e.target.parentNode.querySelector("#newInfo").value
       let infoContentArea = infoSectionNode.querySelector(".userInfoSectionContent");
       if(infoContentArea.firstChild) {
           infoContentArea.removeChild(infoContentArea.firstChild);
        }
        let newText = document.createTextNode(newInfoContent);
        infoContentArea.appendChild(newText);
        
        //dont want unnecessary listener
        infoChange.removeEventListener("submit", infoEditCallback);
        cleanInfoPrompt();
    }
    
    //listener only needed for setup
    infoChange.addEventListener("submit", infoEditCallback);

}

//normally the hash is updated to db and there are checks made with old
//password
function changePassCallback(e) {
    e.preventDefault();
    cleanPassPrompt();
}

//normally the hash is updated to db and there are checks made with old
//password
function changePassAdminCallback(e) {
    e.preventDefault();
    cleanPassAdminPrompt();
}

//adds or removes user to banned database but does nothing for now
//but change the button to say Unban
function banOrUnbanUserCallback(e) {
    changeBanButton();
}

//should add to report database in backend
function reportUserCallback(e) {
    e.preventDefault();
    cleanReportUserPrompt();
}
