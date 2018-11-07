
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
for (i = 0; i < editButtons.length; i++) {
    editButtons[i].addEventListener("click", bringUpInfoPrompt);
}


passChangeButton.addEventListener("click", bringUpPassPrompt);
infoChange.addEventListener("click", bringDownInfoPrompt);
passChange.addEventListener("click", bringDownPassPrompt);
userNotFound.addEventListener("click", bringDownUserPrompt);

usrSearchForm.addEventListener("submit", searchUser);



//normally this function would search a database of users in back end 
//but for front end, itll just not find anything
function searchUser(e) {
    e.preventDefault();
    bringUpUserPrompt(e);
    
}

function bringUpUserPrompt(e) {
    userNotFound.style.display = "block";
}


function bringUpInfoPrompt(e) {
    infoChange.style.display = "block";
    
}


function bringUpPassPrompt(e) {
    passChange.style.display = "block";
    
}

function bringDownInfoPrompt(e) {
    if(e.target.classList.contains("closeBox") || e.target.classList.contains("dialogContainer"))
    {
        infoChange.querySelector("textarea").value = "";
        infoChange.style.display = "none";
    }
}

function bringDownUserPrompt(e) {
    userNotFound.style.display = "none";
}

function bringDownPassPrompt(e) {
    
     if(e.target.classList.contains("closeBox") || e.target.classList.contains("dialogContainer"))
        {
            let textInputs = passChange.querySelectorAll("input[type=\"text\"]");
            let i = 0;
            for(i = 0; i < textInputs.length; i++) {
                textInputs[i].value = "";
            }
            passChange.style.display = "none";
        }    
}