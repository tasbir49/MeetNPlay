"use strict"

const loginForm = document.querySelector('#loginForm')
loginForm.addEventListener('submit',login);



function login(e){
  e.preventDefault();

  const nextPg = validLogin(loginForm.firstElementChild.value,loginForm.firstElementChild.nextElementSibling.value);
  if (nextPg){
    console.log("hi");
    window.location.href = nextPg;
  } else{
    console.log("wrong");
    alert("wrong login please try again");
  }
}

function validLogin(user,pass){

  //api call for correct user name and password
  const rightAdminUser = "admin";
  const rightPosterUser = "poster";
  const rightPostRequestUser = "post_request";
  const rightPass = "password";

  if(rightPass == pass) {
      if(user == rightAdminUser) {
        return "../forum/loggedInForumAdmin.html"
      }
      else if(user == rightPosterUser) {
        return  "../forum/loggedInForumPoster.html"
      }
      else if(user == rightPostRequestUser) {
        return  "../forum/loggedInForumUser.html"
      }
      else {
          return false;
      }
  }
  return false;
}
