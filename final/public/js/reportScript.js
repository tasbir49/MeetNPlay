
//normally the reports would be retrieved from a backend
//database and the DOM would be populated with the results
//for the front end we hardcoded them into the html


const reports = document.getElementsByClassName("reportItem");
let allReports = [];
let reportsPerPage = 3;
let maxPage =Math.ceil(reports.length/reportsPerPage)
let pageNumber = 0;


if(reports) {
    let i = 0;
    for(i = 0; i < reports.length; i++) {
        console.log("heyyyy");
        currButton = reports[i].querySelector(".closeReport");
        currButton.addEventListener("click", closeReport);
        allReports.push(reports[i]);
    }
}

clearPage();

loadReports()

function loadReports(){

  const body = document.getElementsByTagName("BODY")[0];
  for (let i=pageNumber*reportsPerPage;i<(pageNumber+1)*reportsPerPage;i++){
    body.append(allReports[i])
  }
  body.appendChild(pageNav(maxPage))

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
    loadReports();
  }
}

function clearPage(){
  const reportsToDelete = document.getElementsByClassName("reportItem");
  const end = reportsToDelete.length
  for (let i=0;i<end;i++){
    reportsToDelete[0].remove();
  }
  const numbers = document.getElementsByClassName("pageNumberWrapper");
  if (numbers.length !=0){
    numbers[0].remove()
  }
}

//normally this would tell the server to mark the report as
//closed. only open reports are shown on the page so for now
//it is only removed from the page when closing
function closeReport(e) {

    const id =(e.target.parentElement.getAttribute("data_id"));
    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/reports/api/close/"+id);
    xhttp.send();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        allReports = allReports.filter(function(a){
          return a.getAttribute("data_id") != id
        })
      }
      maxPage =Math.ceil(allReports.length/reportsPerPage)
      clearPage();
      loadReports();
    }
    //removeReportFromDOM(e.target.parentNode);
}


function removeReportFromDOM(report) {
    report.parentNode.removeChild(report);
}
