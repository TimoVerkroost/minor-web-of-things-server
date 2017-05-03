(function () {
  /* global io */
  // Check if socket is available
  if (document.getElementById('socketScript')) {
    var socket = io();
    // Define user
    socket.emit('connection_user', socket.id, boxID, username );
    socket.boxID = boxID;
    socket.username = username;
    // Get coffee message
    socket.on('get_coffeee', function () {
      console.log("recieve");
    });
    // Connect user feedback
    socket.on('connection_user', function (id, otherID, otherUser) {
      // Current user
      if (socket.id === id) {

      }
      // Other user
      if (socket.id !== id) {
        console.log("connect " + otherID + " " + otherUser);
      }
    });
    // Disconnect user feedback
    socket.on('disconnect_user', function (id, otherID, otherUser) {
      // Other user
      if (socket.id !== id) {
        console.log("dis: " + otherID + " " + otherUser);
      }
    });
    // Get all connections
    socket.on('get_all_connections', function (allConnected) {
      var getUserList = document.getElementById('connectedUsers');
      getUserList.innerHTML = '';
      for (var u = 0; u < allConnected.length; u++) {
        getUserList.innerHTML += '<li>' + allConnected[u] + '</li>';
      }
      //console.log(allConnected);
    });
    // Get all boxIDs
    socket.on('get_all_boxIDs', function (allBoxes) {
      //console.log(allBoxes);
    });
    // Button press
    socket.on('button_press', function (boxID) {
      var turn = document.getElementById('turn');
      var setCoffee = document.getElementById('setCoffee');
      setCoffee.innerHTML = boxID;
      turn.style.display = 'block';
    });
    // Coffee ready
    socket.on('coffee_ready', function (status) {
      var ready = document.getElementById('ready');
      ready.style.display = 'block';
    });

    // Coffee temp
    socket.on('coffee_temp', function (temp) {
      console.log(temp);
    });
  }
})();