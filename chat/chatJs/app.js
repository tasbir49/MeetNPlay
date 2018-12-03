let app = require('http').createServer(response);
let fs = require('fs');
let io = require('socket.io')(app);
app.listen(3000);
console.log("App running…");

function response(req, res) {
  let file ="";
  if (req.url == "/") {
      file = __dirname + '/chat.html';
  } else {
      file = __dirname + req.url;
  }

  fs.readFile(file,function(err,data)  {
    if (err){
      res.writeHead(404);
      return res.end('Page or file not found');
    }
    res.writeHead(200);
    res.end(data);

 });
}

io.on("connection", function(socket) {
    socket.on("send message", function(sent_msg, callback) {
        sent_msg = "[ " + getCurrentDate() + " ]: " + sent_msg;
        io.sockets.emit("update messages", sent_msg);
        callback();
    });
});
function getCurrentDate() {
    let currentDate = new Date();
    let day = (currentDate.getDate() < 10 ? '0' : '') + currentDate.getDate();
    let month = ((currentDate.getMonth() + 1) < 10 ? '0' : '') + (currentDate.getMonth() + 1);
    let year = currentDate.getFullYear();
    let hour = (currentDate.getHours() < 10 ? '0' : '') + currentDate.getHours();
    let minute = (currentDate.getMinutes() < 10 ? '0' : '') + currentDate.getMinutes();
    let second = (currentDate.getSeconds() < 10 ? '0' : '') + currentDate.getSeconds();
    return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
}
