(function () {
  /* global io */
  // Check if socket is available
  if (document.getElementById('socketScript')) {
    var socket = io();
    // Chat box
    // var chatBox = document.getElementById('chatBox');
    // var nameBox = document.getElementById('name');
    // var connectedCountBox = document.getElementById('connectedUsers');
    // chatBox.addEventListener('submit', function (event) {
    //   socket.emit('chat message', messageBox.value, nameBox.value);
    //   event.preventDefault();
    //   return false;
    // });

    // socket.on('chat message', function (msg, name, id) {
    //   console.log("recieve");
    // });

    socket.on('button_press', function (press) {
      console.log("recieve: " + press);
    });
    socket.on('connection user', function (id, totalConnected) {
      if (socket.id !== id) {
        console.log("connect");
      }
    });
    socket.on('disconnect user', function (id, totalConnected) {
      connectedCountBox.innerHTML = totalConnected;
      if (socket.id !== id) {
        console.log("disconnect");
      }
    });

  }
})();
