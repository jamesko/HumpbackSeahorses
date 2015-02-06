//returns rendered template
var RoomView = Backbone.View.extend({
  template : _.template(
    '<div class="room-display <%- room %>">' +
    '<span>' +
    '<strong><%- room %></strong>' +
    '</span>' +
    '</div>'
  ),

  initialize: function() {
    this.render();
  },

  render : function(){
    this.$el.html(this.template(this.model.attributes));
    return this;
  }
});

var RoomsView = Backbone.View.extend({

  initialize : function(){
    var collection = this.collection;
    collection.on('add', this.render, this);
    collection.on('remove', this.render, this);

    socket.emit('get rooms', 'Need rooms.');

    //socket.io listener for emits
    socket.on('new room', function(rooms){

      _.each(rooms, function(room) {
        var roomName = room.room;
        if (!collection.where({ room: roomName }).length) {
          collection.add(new Room(room));
        }
      });
    });

    socket.on('remove room', function(room) {
      var roomName = room.room;
      var foundRoom = collection.where({room: roomName});

      if (foundRoom.length) {
        collection.remove(foundRoom);
      }

    });

    //storage variable for displayed messages
    this.activeRooms = {};
  },

  render : function () {
    $('.activeRooms').empty().append(this.collection.map(function(room) {
      return new RoomView ({model : room}).$el;
    }));
  }

});
