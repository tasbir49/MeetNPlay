allGames = ["Kirby","Legend of Zelda","Game of Thrones","Super Smash Brothers Brawl"]

//the dialog boxes

const userNotFound = document.querySelector("#userNotFound");


const usrSearchForm = document.querySelector("#userSearchInput");




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
