"use strict";

let allPosts;


let displayPosts;

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
    displayPosts = allPosts.posts;
    maxPage = Math.ceil(displayPosts.length/postPerPage)
    loadPage();
  }
}


//normally this function would search a database of users in back end
//but for front end, itll just not find anything
function searchUser(e) {
    e.preventDefault();
    const searchParam = document.querySelector("#searchParam").value
    displayPosts = displayPosts.filter(function(a){
      return a.gameTitle.includes(searchParam)
    })
    if(displayPosts.length ==0){
      displayPosts = allPosts.posts;
      bringUpUserPrompt(e);
    } else{
      maxPage = Math.ceil(displayPosts.length/postPerPage);
      clearPage();
      loadPage();
    }

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
  status.appendChild(document.createTextNode(post.playersCurrentlyIn+1 + "/"+post.totalPlayers))
  const postTitle = document.createElement("span")
  postTitle.className = "postTitle";
  postTitle.appendChild(document.createTextNode(post.title))
  const posterName = document.createElement("span")
  posterName.className = "gameGenre"
  posterName.appendChild(document.createTextNode(post.creatorName))
  const postPlatform = document.createElement("span")
  postPlatform.className = "gamePlatform"
  postPlatform.appendChild(document.createTextNode(post.platform))
  const datePosted = document.createElement("span")
  datePosted.className = "datePosted"
  datePosted.appendChild(document.createTextNode((new Date(post.date) ).toDateString() ) )

  divGameImg.appendChild(img)
  divGameImg.appendChild(gameTitle)
  divGameImg.appendChild(status)
  divGameImg.appendChild(postTitle)
  divGameImg.appendChild(posterName)
  divGameImg.appendChild(postPlatform)
  divGameImg.appendChild(datePosted)

  const gameDet = document.createElement("div")
  gameDet.className = "gameDetails";

  const inviteBut = createInviteButton(post);
  const reportBut = document.createElement("button")
  reportBut.className = "reportButton";
  reportBut.type = "button"
  reportBut.name = "Report"
  reportBut.setAttribute("data_id",post.creatorName);
  reportBut.appendChild(document.createTextNode("Report"))
  reportBut.addEventListener("click",reportPrompt);

  gameDet.appendChild(inviteBut)
  gameDet.appendChild(reportBut)

  postSection.appendChild(divGameImg)
  postSection.appendChild(gameDet)
  return postSection;
}

function createInviteButton(post){

  console.log(post);
  const inviteBut = document.createElement("button")
  inviteBut.type = "button"
  inviteBut.name = "Request"
  console.log(post);
  if(allPosts.isSessionUserAdmin || post.isSessionUserMember || (post.creatorName == post.sessionUserName)){
    inviteBut.className = "requestGranted";
    inviteBut.appendChild(document.createTextNode("Go to Details"))
    inviteBut.setAttribute("data_id",post._id);
    inviteBut.addEventListener("click",goToPost);
  } else if(post.totalPlayers == post.playersCurrentlyIn+1){
    inviteBut.className = "requestInvite";
    inviteBut.appendChild(document.createTextNode("Full"))
  } else if(post.waitingForInvite){
    inviteBut.className = "requestPending";
    inviteBut.appendChild(document.createTextNode("Waiting for Invite"))
  } else{
    inviteBut.className = "requestInvite";
    inviteBut.appendChild(document.createTextNode("Requst Invite"))
    inviteBut.setAttribute("data_id",post._id);
    inviteBut.addEventListener("click",processRequest)
  }
  return inviteBut;
}

function goToPost(e){
  const id = e.target.getAttribute("data_id")
  console.log(id);

  let xhttp = new XMLHttpRequest();
  xhttp.open("GET", "post/view/"+id);
  xhttp.send();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      window.location = "post/view/"+id
    }
  }
}

function reportPrompt(e){
  const reportIssue = prompt("Reason for Reporting","");
  if(reportIssue != null){
    const perpName = e.target.getAttribute("data_id")
    xhttp.open("POST", "/reports/api/create");
    xhttp.setRequestHeader("Content-Type", "application/json");

    xhttp.send(JSON.stringify({perpetrator: perpName,content: reportIssue}));
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        alert("Report Sent")
      }
      if(this.status ==400){
        alert("Something went wrong")
      }
    }
  } else{
    alert("Report Canceled")
  }


}
function processRequest(e){
  const id =e.target.getAttribute("data_id");

  console.log(id);
  let xhttp = new XMLHttpRequest();
  xhttp.open("POST", "/api/invitereq/"+id);
  xhttp.send();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {

      e.target.className = "requestPending";
      e.target.innerText = "Waiting for Invite"

    }
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
  if(value == "people"){
    displayPosts = allPosts.posts;
    displayPosts = displayPosts.filter(function(a){
      return compare <= a.totalPlayers;
    })
  } else if(value == "platform") {
    displayPosts = allPosts.posts;
    displayPosts =displayPosts.filter(function(a){
      return compare == a.platform;
    })
  } else if(value == "genre"){
    displayPosts = allPosts.posts;
      displayPosts= displayPosts.filter(function(a){
        return a.gameGenres.findIndex(function(b){
          return b == compare;
        }) != -1;
      })
  } else if (value == "sort"){
    if (compare == "by Game Name"){
      displayPosts = displayPosts.sort(function(a,b){
        if (a.gameTitle.toLowerCase()<b.gameTitle.toLowerCase()) {return -1};
        if (a.gameTitle.toLowerCase()>b.gameTitle.toLowerCase()) {return 1};
      })
    } else if (compare == "by Date Posted"){
      displayPosts = displayPosts.sort(function(a,b){
        if (a.date<b.date) {return -1};
        if (a.date>b.date) {return 1};
      })
    }
  } else{
    displayPost = allPosts;
  }
  maxPage = Math.ceil(displayPosts.length/postPerPage);
  clearPage();
  loadPage();
}
