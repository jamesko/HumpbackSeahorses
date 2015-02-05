//returns rendered template
var RoomView = Backbone.View.extend({
  template : _.template(
      '<div class="room-display <%- room %>"> \
        <span> \
          <strong><%- room %></strong> \
        </span> \
      </div>'
  ),
  templateAlt : _.template(
      '<div class="room-display <%- room %>">' +
      '<span>' +
      '<strong><%- room %></strong>' +
      '</span>' +
      '</div>'
  ),

  render : function(userLangFlag){
    if (userLangFlag) {
      this.$el.html(this.template(this.model.attributes));
    } else {
      this.$el.html(this.templateAlt(this.model.attributes));
    }
    $(".activeRooms").append(this.$el);
  }
});

var RoomsView = Backbone.View.extend({

  initialize : function(){
    var collection = this.collection;
    var that = this;
    //this.collection.on('add', this.render, this);
    this.collection.on('remove', this.render, this);

    socket.emit('get rooms', 'Need rooms.');

    //socket.io listener for emits
    socket.on('all rooms', function(room){
      var newModel, i;
      for (var i = room.length - 1; i >= 0; i -= 1) {
        newModel = new Room(room[i]);
        collection.add(newModel);
      }
      that.render();
    });

    //storage variable for displayed messages
    this.activeRooms = {};
  },

  render : function () {
    this.collection.forEach(function(val, key, list) {
      this.renderRoom(val);
    }, this);
  },

  renderRoom : function(room) {
    var roomView = new RoomView ({model : room});
    roomView.render();
  }
});
