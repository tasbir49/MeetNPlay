let socket = io.connect();
$("form#chat").submit(function(e) {
  e.preventDefault();

  socket.emit("send message", $(this).find("#msg_text").val(), function() {
    $("form#chat #msg_text").val("");

  });

});
socket.on("update messages", function(msg){
  let final_message = $("<p />").text(msg);
  console.log(msg);
 $("#history").append(final_message);
});
