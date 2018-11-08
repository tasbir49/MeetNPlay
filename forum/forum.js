allGames = ["Kirby","Legend of Zelda","Game of Thrones","Super Smash Brothers Brawl"]

//the dialog boxes

const userNotFound = document.querySelector("#userNotFound");

const reportButton = document.getElementsByClassName("reportButton")[0]
const requestInviteButton = document.getElementsByClassName("requestInvite")[0]
const usrSearchForm = document.querySelector("#userSearchInput");


requestInviteButton.addEventListener("click",processRequest);
reportButton.addEventListener("click",reportPrompt);
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



function bringDownUserPrompt(e) {
    userNotFound.style.display = "none";
}
var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (panel.style.maxHeight){
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  });
}

function reportPrompt(e){

  const reportIssue = prompt("Reason for Reporting","");
  alert("Issue Reported. Thanks")


  //api call for reporting issue
}
function processRequest(e){
  //api send invite request
  if(requestInviteButton.innerText == "Request Invite"){
    requestInviteButton.innerText = "Invite Requested";
    setTimeout(function () {
      acceptRequest();
    }, 2000);
  }

}

function acceptRequest() {
  requestInviteButton.innerText = "Invited";
}
