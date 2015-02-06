//returns rendered template
var RoomView = Backbone.View.extend({
  tagName: "option",

  template : _.template(
    '<%- room %>'
  ),

  initialize: function() {
    this.render();
  },

  render : function(){
    this.$el.html(this.template(this.model.attributes));
    this.$el.val(this.model.get('room'));
    return this;
  }
});

var RoomsView = Backbone.View.extend({
  initialize : function(){
    var collection = this.collection;
    collection.on('add', this.render, this);
    collection.on('remove', this.render, this);

    socket.emit('get rooms');

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

      foundRoom.length && collection.remove(foundRoom);
    });
  },

  render : function () {
    var room = $('select[name=room]');
    room.empty().append(this.collection.map(function(room) {
      return new RoomView ({model : room}).$el;
    }));
    if (room.find('option[value=lobby]').length === 0) {
      room.prepend('<option value="lobby">lobby</option>');
    }
    room.val($('#room').val() || 'lobby');
  }
});
