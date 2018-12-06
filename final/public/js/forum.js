allPosts = ["Kirby","Legend of Zelda","Game of Thrones","Super Smash Brothers Brawl","Bull","Shiiiit"]
//allPosts = ["hi","fail"]
//the dialog boxes

const postNotFound = document.querySelector("#postNotFound");
const postsOnPage = document.getElementsByClassName("post");
const reportButton = document.getElementsByClassName("reportButton")[0]
const requestInviteButton = document.getElementsByClassName("requestInvite")[0]
const usrSearchForm = document.querySelector("#userSearchInput");
let pageNumber = 0;
const postPerPage = 4
const maxPage = Math.ceil(allPosts.length/postPerPage)


console.log("hi: "+postPerPage);
//requestInviteButton.addEventListener("click",processRequest);
//reportButton.addEventListener("click",reportPrompt);
postNotFound.addEventListener("click", bringDownUserPrompt);

usrSearchForm.addEventListener("submit", searchUser);

console.log(postsOnPage);
initPage();
//normally this function would search a database of users in back end
//but for front end, itll just not find anything
function searchUser(e) {
    e.preventDefault();
    bringUpUserPrompt(e);
}

function bringUpUserPrompt(e) {
    postNotFound.style.display = "block";
}

function bringDownUserPrompt(e) {
    postNotFound.style.display = "none";
}
let acc = document.getElementsByClassName("accordion");
let i;
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

function initPage(){

  const middle = document.getElementById("gamePost")
  const start = postPerPage*pageNumber;
  const end = Math.min(((pageNumber+1)*postPerPage),allPosts.length)
  for (let i =start;i<postPerPage;++i){
    console.log("hi");
    middle.appendChild(makeDefaultPost(allPosts[i]));
  }
  middle.append(pageNav(maxPage))

  console.log(middle);
}

function pageNav(max){
  const pageNumWrapper = document.createElement("div")
  pageNumWrapper.className = "pageNumberWrapper";

  for (let i=1;i<=max;++i){
    const but = document.createElement("button")
    but.type="button"
    but.className = "pageNumber"
    but.name="Page"+(i)
    but.addEventListener("click",loadNewPage);
    but.appendChild(document.createTextNode(i))
    pageNumWrapper.append(but)
  }
  return pageNumWrapper;
}

function loadNewPage(e){
  //e.target.parentElement
}

function makeDefaultPost(post){
  const postSection = document.createElement("section");
  postSection.className = "post";

  const divGameImg = document.createElement("div");
  divGameImg.className = "gameImgIcon"

  const img = document.createElement("img");
  img.className = "gameImg"
  img.setAttribute("src","../resources/images/logo.png")
  const gameTitle = document.createElement("span")
  gameTitle.className = "gameTitle";
  gameTitle.appendChild(document.createTextNode(post))
  const status = document.createElement("span")
  status.className = "status";
  status.appendChild(document.createTextNode("Default"))
  const postTitle = document.createElement("span")
  postTitle.className = "postTitle";
  postTitle.appendChild(document.createTextNode("Default"))

  divGameImg.appendChild(img)
  divGameImg.appendChild(gameTitle)
  divGameImg.appendChild(status)
  divGameImg.appendChild(postTitle)

  const gameDet = document.createElement("div")
  gameDet.className = "gameDetails";

  const inviteBut = document.createElement("button")
  inviteBut.className = "requestInvite";
  inviteBut.type = "button"
  inviteBut.name = "Request"
  inviteBut.appendChild(document.createTextNode("default"))
  inviteBut.addEventListener("click",processRequest)
  const reportBut = document.createElement("button")
  reportBut.className = "reportButton";
  reportBut.type = "button"
  reportBut.name = "Report"
  reportBut.appendChild(document.createTextNode("default"))
  reportBut.addEventListener("click",reportPrompt);

  gameDet.appendChild(inviteBut)
  gameDet.appendChild(reportBut)

  postSection.appendChild(divGameImg)
  postSection.appendChild(gameDet)
  return postSection;

  /**
  <section class="post">
    <div class="gameImgIcon">
      <img src="../resources/images/rayman.jpg" class = "gameImg">
      <span class= "gameTitle">Rayman Origins</span>
      <span class= "status">Status: <strong>1/2</strong></span>
      <span class= "postTitle">Looking for players</span>
    </div>
    <div class="gameDetails">
              <button class ="requestInvite" type="button" name="Request">Request Invite</button>
      <button class ="reportButton" type="button" name="Report">Report</button>

    </div>
  </section>
  **/

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
  requestInviteButton.innerText = "Joined";
  createLink();
}

function createLink() {

    linkNode = document.createElement("a");
    linkNode.setAttribute("id","viewPost");
    linkNode.setAttribute("href", "../forum/post/post-request-view.html");
    linkNode.innerText = "View Post"
    requestInviteButton.parentNode.insertBefore(linkNode, requestInviteButton.nextSibling);

}
