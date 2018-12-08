"use strict"

const loginForm = document.querySelector('#loginForm')
loginForm.addEventListener('submit',create);



function create(e){
  e.preventDefault();


  let xhttp = new XMLHttpRequest();
  xhttp.open("POST", "/users");
  xhttp.setRequestHeader("Content-Type", "application/json");

  const user = document.getElementById("user").value
  const pass = document.getElementById("password").value
  const city = document.getElementById("city").value
  const desc = document.getElementById("description").value
  xhttp.send(JSON.stringify({name:user,password:pass,city:city,about:desc}));
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      window.location = "/"
    }
    if(this.status ==400){
      alert("Something went wrong")
    }
  }
}
