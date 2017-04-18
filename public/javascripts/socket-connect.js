(function () {
  /* global io */
  // Check if socket is available
  if (document.getElementById('socketScript')) {
    var socket = io();

    socket.on('chat message', function (msg, id) {
      console.log("recieve");
    });
    socket.on('connection user', function (id) {
      if (socket.id !== id) {
        console.log("connect");
      }
    });
    socket.on('disconnect user', function (id) {
      if (socket.id !== id) {
        console.log("disconnect");
      }
    });
  }
})();
