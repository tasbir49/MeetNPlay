"use strict"

const loginForm = document.querySelector('#loginForm')
loginForm.addEventListener('submit',create);



function create(e){
  e.preventDefault();


  let xhttp = new XMLHttpRequest();
  xhttp.open("POST", "/users");
  const user = document.getElementById("user")
  const pass = document.getElementById("password")
  const city = document.getElementById("city")
  const desc = document.getElementById("description")
  xhttp.send({user:user,pass:pass,city:city,description:desc});
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      window.location = "/"
    } else{
      alert("error please try again")
    }
  }
}
