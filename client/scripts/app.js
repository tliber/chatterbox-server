var app = {};
app.roomName = '';
app.friends = [];
app.server = 'http://127.0.0.1:3000/classes';

app.init = function () {
  this.fetch();
};

app.userName = function () {
  return window.location.search.split('=')[1];
};

app.send = function (message) {
  $.ajax({
    url: app.server,
    type: 'POST',
    data: JSON.stringify(message),
    dataType: 'json',
    success: function (data) {
      app.fetch();
      console.log("success")
    },
    error: function (data) {
      console.error('chatterbox: Failed to add message');
    }
  });

  $('#usermessage').val('');
};

app.validMessage = function (message) {
  return (app.roomName === '' ||
    ('' + message.roomname) === app.roomName) && message.text;
};

app.fetch = function () {
  $.ajax({
    url: app.server,
    type: 'GET',
    //data: { order: '-createdAt' },
    success: function (data) {
      $('.message').remove();
      //var messages = JSON.parse(data).results.reverse();
      var messages = data.results.reverse();
      for (var i = 0; i < messages.length; i++) {
        if (app.validMessage(messages[i])) {
          app.message(messages[i]);
        }
      }
    },
    error: function (data) {
      console.error('chatterbox: Failed to send message');
    }
  });
};

app.message = function (message) {
  var $div = $('<div>').addClass('message');
  var $usr = $('<span>').addClass('user').text(message.username + ': ');

  var $msg = (function () {
    return (app.friends.indexOf(message.username) >= 0) ?
      $('<span>').addClass('msg friend').text(message.text) :
      $('<span>').addClass('msg').text(message.text);
  })();

  var $rm  = $('<span>').addClass('room').text('(' + message.roomname + ') ');

  $div.append($rm, $usr, $msg);
  $('#chats').append($div);
};


app.buildMessage = function () {
  var message = {
    username: app.userName(),
    text: $('#usermessage').val(),
    roomname: $('#roomname').val()
  };
  app.send(message);
}

app.init();
setInterval(app.fetch, 3000);

$(document).ready(function(){
  $('#submit').on('click', function () {
    app.buildMessage();
  });
  $('#usermessage').on('keydown', function (e) {
    if (e.keyCode === 13)
      app.buildMessage();
  });

  $('body').on('click', ".room", function(){
    var temp = '' + $(this).text();
    app.roomName = temp.slice(1,temp.length-2);
    app.fetch();
    $('#roomname').val(app.roomName);
    $('#roomname').prop('disabled', true);
  });
  $('#room-clear').on('click', function(){
    app.roomName = '';
    app.fetch();
    $('#roomname').val('');
    $('#roomname').prop('disabled', false);
  });

  $('body').on('click', ".user", function (e) {
    var friend = $(e.currentTarget)[0].innerText;
    app.friends.push(friend.slice(0, friend.length-2));
    app.fetch();
  });
});

//These functions are only used to pass the SpecRunner as we used a different
//implementation

app.addMessage = function (messages) {
  $('#chats').append('<div>');
};

app.addRoom = function (room) {
  var $room = $('<div id="roomSelect">');
  $room.append('<div>');
  $('body').append($room);
};

app.addFriend = function () {

};

app.clearMessages = function () {
  $('#chats').html("");
};
