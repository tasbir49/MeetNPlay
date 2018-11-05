"use strict"

const loginForm = document.querySelector('#loginForm')
loginForm.addEventListener('submit',login);



function login(e){
  e.preventDefault();


  if (validLogin(loginForm.firstElementChild.value,loginForm.firstElementChild.nextElementSibling.value)){
    console.log("hi");
    window.location.href = "../forum/forum.html";
  } else{
    console.log("wrong");
    alert("wrong login please try again");
  }
}

function validLogin(user,pass){

  //api call for correct user name and password
  const rightUser = "Test"
  const rightPass = "Test"

  return rightUser == user && rightPass == pass
}
