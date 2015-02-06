//initialize
var socket = io();
var vent = _.extend({}, Backbone.Events);

$(function(){
  //display users language functionality
  $('#dispLang').on('click', function(){
    vent.trigger('click:dispLang', this.checked);
  });

  var messages = new Messages();
  var submitView = new SubmitView({
    el: $('.submitView'),
    collection: messages
  });

  var messagesView = new MessagesView({
    el: $('#messagesView'),
    collection: messages
  });

  var rooms = new Rooms();
  var roomsView = new RoomsView({
    el: $('.activeRooms'),
    collection: rooms
  });

  var usersInRoomView = new UsersInRoomView({
    collection: messages
  });

  //define injectable/removable styles for user message ignoring and highlighting
  var styleTool = function(id, action, val) {
    var rule = "";
    if(action === "ignoreON"){
      rule = '.message-display[data-user_id="' + id + '"] { display: none; }';
      rule = rule + '[data-user_id="' + id + '"] { color: grey; }';
    }else if(action === "highlightON"){
      //rule = ???
    }else if(action === "ignoreOFF" || "highlightOFF"){
      $('style[data-user_id="' + id + '"]').remove();
      return;
    }
    var div = $("<div />", {html: '&shy;<style data-user_id="' + id + '">' + rule + '</style>'})
              .appendTo("body");
  };

});
