
//the dialog boxes
const infoChange = document.querySelector("#infoChange");
const passChange = document.querySelector("#passChange");
const userNotFound = document.querySelector("#userNotFound");

//the edit buttons
const editButtons = document.querySelectorAll(".infoEditButton");


const passChangeButton = document.querySelector("#changePassButton");


const usrSearchForm = document.querySelector("#userSearchInput");

//event listeners
let i = 0;

if(editButtons) {
    for (i = 0; i < editButtons.length; i++) {
        editButtons[i].addEventListener("click", editInfoCallback);
    }
}

if(passChangeButton) {
    passChangeButton.addEventListener("click", openPassPromptCallback);
}
if(infoChange){
    infoChange.addEventListener("click", closeInfoPromptCallback);
}

if(passChange){ 
    passChange.addEventListener("click", closePassPromptCallback);
    passChange.addEventListener("submit", changePassCallback);
}

userNotFound.addEventListener("click", closeUserNotFoundPromptCallback);

usrSearchForm.addEventListener("submit", searchUserCallback);



//normally this function would search a database of users in back end /
//and redirect to the found user's page
//but for front end, itll just not find anything
function searchUserCallback(e) {
    e.preventDefault();
    openUserNotFoundPromptCallback(e);
    
}



function openUserNotFoundPromptCallback(e) {
    userNotFound.style.display = "block";
}

function closeUserNotFoundPromptCallback(e) {
    userNotFound.style.display = "none";
}



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