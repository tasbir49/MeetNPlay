
//normally the reports would be retrieved from a backend
//database and the DOM would be populated with the results
//for the front end we hardcoded them into the html
const reports = document.querySelectorAll(".reportItem");

if(reports) {
    let i = 0;
    for(i = 0; i < reports.length; i++) {
        currButton = reports[i].querySelector(".closeReport");
        currButton.addEventListener("click", closeReport);
    }
}



//normally this would tell the server to mark the report as
//closed. only open reports are shown on the page so for now
//it is only removed from the page when closing
function closeReport(e) {
    removeReportFromDOM(e.target.parentNode);
}


function removeReportFromDOM(report) {
    report.parentNode.removeChild(report);
}