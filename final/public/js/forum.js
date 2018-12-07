"use strict";

let allPosts = ["Kirby","Legend of Zelda","Game of Thrones","Super Smash Brothers Brawl","Bull","Page2","stuff page2","more page 3"]
//displayPosts = ["hi","fail"]
//the dialog boxes

let displayPosts = allPosts;

const postNotFound = document.querySelector("#postNotFound");
const postsOnPage = document.getElementsByClassName("post");
const reportButton = document.getElementsByClassName("reportButton")[0]
const requestInviteButton = document.getElementsByClassName("requestInvite")[0]
const usrSearchForm = document.querySelector("#userSearchInput");
let pageNumber = 0;
const postPerPage = 3;
let maxPage;

postNotFound.addEventListener("click", bringDownUserPrompt);

usrSearchForm.addEventListener("submit", searchUser);



let acc = document.getElementsByClassName("accordion");

for (let i = 0; i < acc.length; i++) {
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

let filters = document.getElementsByClassName("accordionButton")
for (let i =0 ;i<filters.length;i++){
  filters[i].addEventListener("click",applyFilter)
}


let xhttp = new XMLHttpRequest();
xhttp.open("GET", "/posts/");
xhttp.send();
xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    allPosts = JSON.parse(this.response);
    displayPosts = allPosts;
    maxPage = Math.ceil(displayPosts.length/postPerPage)
    loadPage();
  }
}


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

function loadPage(){

  const middle = document.getElementById("gamePost")
  const start = postPerPage*pageNumber;
  const end = Math.min(((pageNumber+1)*postPerPage),displayPosts.length)
  for (let i =start;i<end;++i){
    middle.appendChild(makeDefaultPost(displayPosts[i]));
  }
  middle.append(pageNav(maxPage))
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
  if(pageNumber +1 != e.target.innerText){
    pageNumber = e.target.innerText-1;
    clearPage();
    loadPage();
  }
}

function clearPage(){
  const page = document.getElementsByClassName("post");
  const length = page.length
  for (let i=0;i<length;++i){
    page[0].remove()
  }
  const numbers = document.getElementsByClassName("pageNumberWrapper");
  numbers[0].remove()
}
function makeDefaultPost(post){
  const postSection = document.createElement("section");
  postSection.className = "post";

  const divGameImg = document.createElement("div");
  divGameImg.className = "gameImgIcon"

  const img = document.createElement("img");
  img.className = "gameImg"
  img.setAttribute("src",post.gamePicUrl)
  const gameTitle = document.createElement("span")
  gameTitle.className = "gameTitle";
  gameTitle.appendChild(document.createTextNode(post.gameTitle))
  const status = document.createElement("span")
  status.className = "status";
  status.appendChild(document.createTextNode(post.members.length+1 + "/"+post.playersNeeded))
  const postTitle = document.createElement("span")
  postTitle.className = "postTitle";
  postTitle.appendChild(document.createTextNode(post.title))

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
  inviteBut.appendChild(document.createTextNode("Requst Invite"))
  inviteBut.addEventListener("click",processRequest)
  const reportBut = document.createElement("button")
  reportBut.className = "reportButton";
  reportBut.type = "button"
  reportBut.name = "Report"
  reportBut.appendChild(document.createTextNode("Report"))
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


function applyFilter(e){
  const value = e.target.value;
  const compare =e.target.innerText;
  displayPosts = allPosts;
  if(value =="people"){
    displayPosts = displayPosts.filter(function(a){
      return compare == a.members.length+1;
    })
  } else if(value =="platform") {
    displayPosts =displayPosts.filter(function(a){
      return compare == a.platforms;
    })
  } else if(value == "genre"){
      displayPosts = displayPosts.filter(function(a){
        return a.gameGenres.findIndex(function(b){

          return b == compare;
        }) != -1;
      })
  } else if (value == "sort"){
    if (compare == "by Game Name"){
      console.log("name");
      displayPosts = displayPosts.sort(function(a,b){
        if (a.gameTitle<b.gameTitle) {return -1};
        if (a.gameTitle>b.gameTitle) {return 1};
      })
    } else if (compare == "by Date Posted"){
      console.log("date");
      displayPosts = displayPosts.sort(function(a,b){
        if (a.dateMade<b.dateMade) {return 1};
        if (a.dateMade>b.dateMade) {return -1};
      })
    }
  } else{
    displayPost = allPosts;
  }
  maxPage = Math.ceil(displayPosts.length/postPerPage);
  clearPage();
  loadPage();
}
