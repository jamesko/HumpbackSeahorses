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
  })
});
