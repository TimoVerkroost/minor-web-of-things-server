(function () {
  /* global io */
  var totalUsers = document.getElementById('totalUsers');
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
    socket.on('connection_user', function (id, otherID, otherUser, totalConnected) {
      // Current user
      if (socket.id === id) {
        totalUsers.innerHTML = totalConnected;
      }
      // Other user
      if (socket.id !== id) {
        console.log("connect " + otherID + " " + otherUser);
        totalUsers.innerHTML = totalConnected;
      }
    });
    // Disconnect user feedback
    socket.on('disconnect_user', function (id, otherID, otherUser, totalConnected) {
      // Other user
      if (socket.id !== id) {
        console.log("dis: " + otherID + " " + otherUser);
        totalUsers.innerHTML = totalConnected;
      }
    });
    // Get all connections
    socket.on('get_all_connections', function (allConnected) {
      var getUserList = document.getElementById('connectedUsers');
      getUserList.innerHTML = '';
      for (var u = 0; u < allConnected.length; u++) {
        getUserList.innerHTML += '<div>' + allConnected[u] + '</div>';
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
      // After 10 min hide
      setTimeout(function(){
        turn.style.display = 'none';
      }, 600000);
    });
    // Coffee ready
    socket.on('coffee_ready', function (status) {
      if(status === 'true') {
        var ready = document.getElementById('ready');
        ready.style.display = 'block';
        // After 5 min hide
        setTimeout(function(){
          ready.style.display = 'none';
        }, 300000);
      }
    });

    // Coffee temp
    socket.on('coffee_temp', function (temp) {
      document.getElementById('coffeeTemp').innerHTML = temp;
    });

    // Outside temp
    socket.on('outside_temp', function (temp) {
      document.getElementById('tempC').innerHTML = temp;
    });
  }
})();